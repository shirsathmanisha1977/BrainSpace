import { Item } from "@/types";

export const shareItem = async (item: Item) => {
  if (!navigator.share) {
    if (item.type === 'link') {
      try {
        await navigator.clipboard.writeText(item.url);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Sharing is not supported and clipboard access failed.");
      }
    } else {
       alert("Sharing images is not supported on this browser.");
    }
    return;
  }

  try {
    if (item.type === 'link') {
      await navigator.share({
        title: item.title,
        url: item.url
      });
    } else {
      // Try sharing as file if it's a data URL
      try {
        const res = await fetch(item.url);
        const blob = await res.blob();
        const file = new File([blob], `image-${Date.now()}.jpg`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: item.title,
            text: item.aiNotes || item.title,
            files: [file]
          });
          return;
        }
      } catch (e) {
        console.error("Could not construct file for sharing", e);
      }
      
      // Fallback
      await navigator.share({
        title: item.title,
        text: item.aiNotes || item.title,
      });
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};
