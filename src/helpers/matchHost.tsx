export default function matchHost(link: string) {
  const match = link.match(
    /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/im
  );

  const hosts = ["pigu.lt", "varle.lt", "skytech.lt"];

  if (match) {
    const userHost = match[1];

    if (hosts.includes(userHost)) {
      return userHost;
    } else {
      return "No match found";
    }
  } else {
    return "Invalid link";
  }
}
