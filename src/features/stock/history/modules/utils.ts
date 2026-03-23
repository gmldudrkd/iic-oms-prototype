export const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

export const generateRandomChannelColor = (channels: string[]) => {
  const channelMap = new Map<string, string>([]);

  const storedChannelColorMap = JSON.parse(
    localStorage.getItem("channelColorMap") || "{}",
  ) as Record<string, string>;

  Object.entries(storedChannelColorMap).forEach(([channel, color]) => {
    channelMap.set(channel, color);
  });

  channels.forEach((channel) => {
    if (!channelMap.has(channel)) {
      channelMap.set(channel, generateRandomColor());
    }
  });

  const channelMapObject = Object.fromEntries(channelMap);
  localStorage.setItem("channelColorMap", JSON.stringify(channelMapObject));

  return channelMap;
};
