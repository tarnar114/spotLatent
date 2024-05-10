
import { useMemo } from "react";
import * as d3 from "d3"
const AxisH = ({
  domain = [0, 100],
  range = [10, 290],
}) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain(domain)
      .range(range)
    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )
    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])
  return (
    <svg>
      <g
        transform={`translate(3, 0)`}
      >
        <path
          d={[
            "M", range[0], 0,
            "H", range[1],
          ].join(" ")}
          fill="none"
          stroke="currentColor"
        />
        {ticks.map(({ value, xOffset }) => (
          <g
            key={value}
            transform={`translate(${xOffset}, 0)`}
          >
            <line
              y2="6"
              stroke="currentColor"
            />
            <text
              key={value}
              style={{
                fontSize: "10px",
                textAnchor: "middle",
                transform: "translate(0,20px)"
              }}>
              {value}
            </text>
          </g>

        ))}
      </g>
    </svg>
  )
}
export default AxisH;

