'use client';
export default function DownloadButton({URL}:{URL:string}) {
  const handleDownload = () => {
    console.log("url :",URL);
    window.open(URL,"_blank");
  };

  return (
    <button onClick={handleDownload}>
      downlode
    </button>
  );
}
