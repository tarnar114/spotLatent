import { useMemo } from "react";
import * as d3 from "d3"
const AxisV = ({
  domain = [100, 0],
  range = [10, 320],
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
        transform={`translate(0, 6)`}
      >
        <path
          d={[
            "M", 30, range[0],
            "V", range[1],
          ].join(" ")}
          fill="none"
          stroke="currentColor"
        />
        {
          ticks.map(({ value, xOffset }) => (
            <g
              key={value}
              transform={`translate(30, ${xOffset})`}
            >
              <line
                x2="-6" // Adjusted x2 attribute for vertical line
                stroke="currentColor"
              />
              <text
                key={value}
                style={{
                  fontSize: "10px",
                  textAnchor: "end", // Adjusted textAnchor for vertical alignment
                  transform: "translate(-8px,3px)"
                }}
              >
                {value}
              </text>
            </g>
          ))
        }
      </g>
    </svg>
  )
}
export default AxisV;

