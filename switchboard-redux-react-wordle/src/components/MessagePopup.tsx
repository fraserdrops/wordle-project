export default function MessagePopup(props: { message: string }) {
  const { message } = props;
  return (
    <div
      style={{
        background: "black",
        color: "white",
        zIndex: 10,
        minHeight: 30,
        borderRadius: 5,
      }}
    >
      <p
        style={{
          margin: 0,
          padding: 5,
        }}
      >
        {message}
      </p>
    </div>
  );
}
