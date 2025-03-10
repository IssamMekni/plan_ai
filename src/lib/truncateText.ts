export  function truncateText(text: string, minLength: number = 80, maxLength: number =90, suffix: string = "..."): string {
    if (text.length <= maxLength) return text;

    let truncated = text.slice(0, maxLength - suffix.length);
    let lastSpace = truncated.lastIndexOf(" ");

    if (lastSpace >= minLength) {
        truncated = truncated.slice(0, lastSpace);
    }

    return truncated + suffix;
}

