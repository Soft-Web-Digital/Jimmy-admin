export default function downloadFile(url: string, fileName: string): void {
  const link: HTMLAnchorElement = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
