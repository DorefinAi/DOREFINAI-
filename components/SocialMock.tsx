const channels = [
  { name: "Feed post", when: "Mon · morning", lines: [92, 64] },
  { name: "Short video", when: "Tue · evening", lines: [78, 40] },
  { name: "Newsletter", when: "Thu · midday", lines: [96, 88, 52] },
];

// Schematic only: one draft fanned out into per-channel versions.
export default function SocialMock() {
  return (
    <figure className="mock">
      <div className="mock-head">
        Publishing plan
        <span className="mock-tag">Socia-L AI</span>
      </div>
      <div className="fan">
        <div className="fan-source">
          <span className="fan-label">Your draft</span>
          <i style={{ width: "94%" }} />
          <i style={{ width: "86%" }} />
          <i style={{ width: "90%" }} />
          <i style={{ width: "58%" }} />
        </div>
        <ul className="fan-out">
          {channels.map((channel) => (
            <li key={channel.name}>
              <div className="fan-row">
                <span className="fan-label">{channel.name}</span>
                <span className="fan-when">{channel.when}</span>
              </div>
              {channel.lines.map((width, index) => (
                <i key={index} style={{ width: `${width}%` }} />
              ))}
            </li>
          ))}
        </ul>
      </div>
      <figcaption>Illustration: one draft, adapted and scheduled for each channel.</figcaption>
    </figure>
  );
}
