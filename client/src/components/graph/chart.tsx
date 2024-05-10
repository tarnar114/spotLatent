import { useMemo, useState } from "react"
import { useChartDimensions } from "../../hooks/useChartDimensions"
import Tooltip from "./Tooltip"
import * as d3 from "d3"
import AxisH from "./axisH"
import AxisV from "./axisV"
const chartSettings = {
  "marginLeft": 35,
  "marginRight": 35,
  "marginTop": 35,
  "marginBottom": 35
}
const ChartWithDimensions = ({ data }) => {
  const [ref, dms] = useChartDimensions(chartSettings)
  const [points, setPoints] = useState()
  const [hovered, setHovered] = useState(null);
  const xScale = useMemo(() => (
    d3.scaleLinear()
      .domain([-10, 10])
      .range([0, dms.boundedWidth])
  ), [dms.boundedWidth])
  const yScale = useMemo(() => (
    d3.scaleLinear()
      .domain([10, -10])
      .range([0, dms.boundedHeight,])
  ), [dms.boundedHeight])
  const delaunay = useMemo(() => {
    const formattedData = data.map((d) => [xScale(d.PCA1), yScale(d.PCA2)])
    const delaunay = d3.Delaunay.from(formattedData)
    const items = []
    let j = 0
    for (let i = 0; i < delaunay.points.length; i += 2) {
      items[j] = [delaunay.points[i], delaunay.points[i + 1]]
      j++
    }
    setPoints(items)
    return delaunay
  }, [data, xScale, yScale])
  const voronoi = useMemo(() => {
    if (dms.boundedWidth !== 0 && dms.boundedHeight !== 0) {
      return delaunay.voronoi([dms.marginLeft, dms.marginTop, dms.boundedWidth, dms.boundedHeight]);
    }
  }, [dms.boundedWidth, dms.boundedHeight, dms.marginLeft, dms.marginTop, delaunay]);
  const circleClick = (e) => {
    const cx = e.target.getAttribute('cx')
    console.log(cx)
    const cy = e.target.getAttribute('cy')
    console.log(cy)
    const index = delaunay.find(cx, cy)
    const gen = voronoi?.neighbors(index)
    let sqrt = Math.sqrt(Math.pow(dms.boundedWidth, 2) + Math.pow(dms.boundedHeight, 2))
    let smallestIndex = 0
    for (const item of gen) {
      const diffX = cx - points[item][0]
      const diffY = cy - points[item][1]
      const itemHypo = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
      if (itemHypo < sqrt) {
        sqrt = itemHypo
        smallestIndex = item
      }
    }
    console.log(smallestIndex)
    console.log(points[smallestIndex])
    console.log(xScale.invert(points[smallestIndex][0]))
    console.log(yScale.invert(points[smallestIndex][1]))
    console.log(data[smallestIndex])

  }
  console.log(points)
  const delaunayPath = delaunay.render();
  return (
    <div
      className="Chart__wrapper"
      ref={ref}
      style={{ height: "500px", width: "500px" }}
    >
      <svg width={dms.width} height={dms.height}>
        <g transform={`translate(${[
          dms.marginLeft,
          dms.marginTop
        ].join(",")})`}>
          <rect
            width={dms.boundedWidth}
            height={dms.boundedHeight}
            fill="lavender"
          />
          <svg
            width={dms.boundedWidth}
            height={dms.boundedHeight}
          >
            <path d={delaunayPath} stroke="grey" fill="transparent" opacity={0.2} />
            {data.map((pca, i) => {
              return (
                <circle
                  key={i}
                  cx={xScale(pca.PCA1)}
                  cy={yScale(pca.PCA2)}
                  stroke="#cb1dd1"
                  opacity={1}
                  fill="#cb1dd1"
                  fillOpacity={0.2}
                  r={3}
                  onClick={circleClick}
                  onMouseEnter={() => setHovered({
                    xPos: xScale(pca.PCA1),
                    yPos: yScale(pca.PCA2),
                    name: pca.name
                  })}
                  onMouseLeave={() => {
                    setHovered(null)
                  }}
                />)
            })}
          </svg>
          <g transform={`translate(${[
            -3,
            dms.boundedHeight,
          ].join(",")})`}>
            <AxisH domain={xScale.domain()} range={xScale.range()} />
          </g>
          <g transform={`translate(${[
            -30, -6
          ].join(",")})`}>
            <AxisV domain={yScale.domain()} range={yScale.range()} />
          </g>
          {/* Tooltip */}
        </g>
      </svg>
      <div
        style={{
          width: dms.boundedWidth,
          height: dms.boundedHeight,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          marginLeft: 35,
          marginTop: 35,
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>

    </div>
  )
}
export default ChartWithDimensions
