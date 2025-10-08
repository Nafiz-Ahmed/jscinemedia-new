export default function goWP() {
  const appLink = "whatsapp://send?phone=+8801779578933";
  const webLink = "https://wa.me/+8801779578933";

  // Try opening the WhatsApp app
  window.location.href = appLink;

  // If the app isn't installed, fallback to web after 1s
  setTimeout(() => {
    window.open(webLink, "_blank");
  }, 1000);
}
