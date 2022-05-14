export function getCookie(cookie: string, name: string) {
  function escape(s: string) {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
  }

  const match = cookie.match(RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)'));

  return match ? match[1] : null;
}
