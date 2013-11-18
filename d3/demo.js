angular.module('bonanzaWebappApp')
  .directive('scatterChart', function (d3, nv, _, Transaction, $rootScope, $timeout) {
    function preprocessData (scope) {
      var dots = scope.dots,
        noBidDots = scope.noBidDots,
        curves = scope.curves,
        dCurves = scope.dCurves,
        data = [], xDots = []

      _.each(_.groupBy(dots, 'IsBid'), function (val, key) {
        var keyName = (key === 'true' ? 'bid' : 'offer')
        data.push({
          key: keyName,
          values: val
        })
      })
      _.each(_.groupBy(noBidDots, 'IsBid'), function (val, key) {
        var keyName = (key === 'true' ? 'bid' : 'offer')
        xDots.push({
          key: keyName,
          values: val
        })
      })
      var ldata = [
        { key: 'dynamic', values: dCurves || [] },
        { key: 'static', values: curves || [] }
      ]
      return {
        dots: data,
        ldata: ldata,
        xDots: xDots
      }
    }
    return {
      templateUrl: '/views/scatterTpl.html',
      restrict: 'E',
      link: function postLink(scope, element) {
        nv.addGraph(function() {
          var colors = d3.scale.category10();
          var keyColor = function(d) {
            return colors(d.key)
          };
          var sel = d3.select(element[0])
          var chart = nv.models.scatterChart()
                        .showDistX(true)
                        .showDistY(true)
                        .useVoronoi(false)
                        .color(keyColor);

          chart.xAxis.tickFormat(d3.format('.02f'))
          // chart.xAxis.axisLabel('Term')
          chart.yAxis.tickFormat(d3.format('.02f'))
          // chart.yAxis.axisLabel('Yield')
          chart.margin({top: 30, right: 10, bottom: 30, left: 45})
            // .xPadding(0.1)
            // .yPadding(0.1)
          // chart.xDomain(d3.extent(Transaction.getAllDots().map(function (d) { return d.Term})))
          // chart.yDomain(d3.extent(Transaction.getDots().map(function (d) { return d.Yield})))
          chart
            .xDomain($rootScope.bondFilter.custom.range)
            .yDomain([0, 10])
          chart.tooltipContent(function (key, x, y, e) {
            var d = e.point
            return '<div>' + d.BondCode + ' ' + d.BondName + ' ' + d.Yield + '</div>' +
                     '<div>uid: '+ d.uid + '</div>' + '<hr />' +
                     '<div>'+ (d.IsBid ? 'bid' : 'offer') + d.Amount + '万' + '</div>' + //'<hr />' +
                     '<div>估值:' + d.YieldVal + ', ' + d.PriceVal + '</div>' +
                     '<div>最优OFR:' + (d.Yield === -1 ? '未知' : d.Yield) + '</div>' + '' +
                     '<div>最新成交: --</div>' + //'<hr />' +
                     '<div>' + d.BrokerName + 'Tel:' + d.Tel + '</div>'
          })
          chart
            .size(function(d) { return Math.sqrt(d.Amount / Math.PI) })
            .x(function(d) { return d.Term })
            .y(function(d) { return d.Yield })
            .text(function(d) { return d.BondCode })
          chart.scatter.pointKey(function (d) {
            return d.uid
          })
          chart.scatterX.pointKey(function (d) {
            return d.uid
          })
          var buildChart = _.once(function (){
            sel.select('svg', element)
              .call(chart)
            element.parent('.chart-wrap').on('resizestop', _.debounce(chart.update, 500))
          })
          scope.reset = function () {
            chart.resetZoom()
          }
          function updateChart() {
            sel.select('svg', element)
            .datum(preprocessData(scope))
            .transition().duration(500)
            buildChart()
            chart.update()
          }
          scope.$on('viewUpdated', updateChart)
          updateChart()
          chart.scatter.dispatch.on('elementClick.point', function (e) {
            var d = e.point
            scope.gridDots.forEach(function (n, i) {
              // 图上的点可能有两个方向，而表中只可能有一个方向
              if (n.BondCode === d.BondCode) {
                scope.gridOption.selectItem(i, true)
              }
            })
            scope.$apply()
          })
          chart.dispatch.on('canvasClick.removeRelated', function () {
            if (scope.gridOption.selectedItems.length === 0) { return }

            scope.gridOption.selectAll(false)
            scope.$apply()
          })
          chart.dispatch.on('brushend', function (e, b) {
            scope.$emit('xChange', b.extent())
          })
          function getPoint (d) {
            return sel.select('.nv-chart-' + chart.id() + ' .nv-point-' + d.uid)
          }
          function relate () {
            scope.dots.forEach(function (d) {
              if (Transaction.isRelated(d, scope.gridOption.selectedItems)) {
                getPoint(d).classed('faded', false)
                d.faded = false
              } else {
                getPoint(d).classed('faded', true)
                d.faded = true
              }
            })
            var xDomain = d3.extent(scope.dots.filter(function(d) { return !d.faded }),
              function (d) { return d.Term })
            var yDomain = d3.extent(scope.dots.filter(function(d) { return !d.faded }),
              function (d) { return d.Yield })

            var ex = (xDomain[1] - xDomain[0] + 1)  * 0.1
            chart.xScale().domain([+xDomain[0] - ex, +xDomain[1] + ex])
            chart.yScale().domain([+yDomain[0] - ex, +yDomain[1] + ex])
            chart.zoomer.x(chart.xScale()).y(chart.yScale())

          }
          scope.$on('afterSelectionChange', function (e, item) {
            if (scope.gridOption.selectedItems.length === 0) {
              scope.dots.forEach(function (d) {
                getPoint(d)
                  .classed('faded', false)
                  .classed('focus', false)
                d.faded = false
                d.focus = false
              })

              chart.xScale().domain($rootScope.bondFilter.custom.range)
              chart.yScale().domain([0, 10])
              chart.zoomer.x(chart.xScale()).y(chart.yScale())
              chart.resetZoom()
            } else {
              scope.dots.filter(function (d) {
                return d.BondCode === item.entity.BondCode
              }).forEach(function (d) {
                getPoint(d)
                  .classed('focus', true)
                d.faded = false
                d.focus = true
              })
              relate()
              chart.updateScale(250)
            }
            scope.$emit('afterRalateChange')
            if (scope.gridOption.selectedItems.length > 0) {
              $timeout(function () {
                var grid = scope.gridOption.ngGrid
                var rowIndex = scope.gridDots.filter(function (row) {return !row.hidden && !row.faded }).indexOf(scope.gridOption.selectedItems[0])
                grid.$viewport.scrollTop(grid.rowMap[rowIndex] * grid.config.rowHeight)
              }, 500)
            }
          });
          $rootScope.$watch('bondFilter.custom.range', _.debounce(function () {
            chart.xDomain($rootScope.bondFilter.custom.range)
            chart.update()
          }, 500, false), true)
          return chart;
        });
      }
    };
  });