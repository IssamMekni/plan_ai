import { useEffect, useState } from "react";

function InlineSvg({ url }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(setSvgContent)
      .catch(console.error);
  }, [url]);

  return (
    <div
    // style={{ width: "150px", height: "350px" }}
    

      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

export default function App() {
  return (
    <div className="scale-100">
      {/* <h1>Inline SVG</h1> */}
      <InlineSvg url="http://localhost:3030/svg/SyfFKj2rKt3CoKnELR1Io4ZDoSa70000" />
    </div>
  );
}
