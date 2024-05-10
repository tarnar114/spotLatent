
export default function Tooltip({ interactionData }) {
  if (!interactionData) {
    return null;
  }
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: 'white',
        fontSize: '12px',
        padding: '4px',
        marginLeft: '15px',
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {interactionData.name}
    </div>
  )
}
