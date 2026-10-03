import { ellipse, line, path, type Ctx } from './primitives';
import { impasto, paint } from './materials';

export const hasStyledCat = (id: string) =>
  ['cubism', 'bauhaus', 'gothic', 'post', 'impression', 'nouveau', 'ukiyo'].includes(id);
export function drawStyledCat(c: Ctx, id: string, time: number) {
  c.save();
  c.translate(317, 438 + Math.sin(time * 2.1) * 0.45);
  const sway = Math.sin(time * 2.6) * 4;
  if (id === 'bauhaus') {
    ellipse(c, 0, -28, 31, 31, '#254880');
    ellipse(c, -24, -3, 10, 4, '#262929');
    ellipse(c, 23, -3, 10, 4, '#262929');
    path(c, `M-28-18Q${-52 - sway}-21-30-47`, undefined, '#252928', 4);
    path(c, 'M-11-92L-15-74 12-74 9-95Z', '#e4b740');
    path(c, 'M-17-76H22V-45H-17Z', '#bd3435');
    path(c, 'M-17-61H22V-45H-17Z', '#dd5f46');
    line(c, 1, -69, 1, -54, '#f4e9c8', 2);
    ellipse(c, -9, -67, 1.5, 3, '#fff1d0');
    ellipse(c, 11, -67, 1.5, 3, '#fff1d0');
    path(c, 'M-2-58l4 0-2 4Z', '#232828');
    for (let i = 0; i < 3; i++) {
      line(c, -10, -56 + i * 3, -29, -60 + i * 7, '#282e32', 0.65);
      line(c, 14, -56 + i * 3, 35, -60 + i * 7, '#282e32', 0.65);
    }
    c.restore();
    return;
  }
  if (id === 'cubism') {
    path(c, 'M-39-3L-44-30-25-67 8-79 29-61 20-4Z', '#30393b', '#4c4d43', 1);
    path(c, 'M-39-3L-13-29 8-79 9-6Z', '#222e31');
    path(c, 'M9-6L20-4 29-61 9-79Z', '#d1c4a4');
    path(c, 'M-9-84L-10-110 5-101 23-108 35-82 25-67 0-69Z', '#283a3e', '#3a443f', 1);
    path(c, 'M11-102L22-106 35-82 25-67 10-76Z', '#e6dabd');
    path(c, 'M-3-97l7 4-5 5Z', '#d6ba56');
    path(c, 'M18-93l9 3-8 5Z', '#605b40');
    for (let i = 0; i < 6; i++) line(c, -31, -47 + i * 6, 6, -44 + i * 7, '#717d7950', 0.55);
    path(c, `M-31-5Q${-55 - sway}-6-40-22`, undefined, '#2f3a3c', 5);
    c.restore();
    return;
  }
  if (id === 'gothic') {
    path(c, `M-31-7Q${-68 - sway}-4-56-26Q-44-38-35-23`, undefined, '#485366', 8);
    path(c, `M-31-7Q${-68 - sway}-4-56-26Q-44-38-35-23`, undefined, '#a1adbc', 5);
    paint(
      c,
      'M-12-72Q-43-75-49-38Q-51-8-29-4L24-4Q31-10 24-32Q24-60 6-71Z',
      '#9ca8b9',
      id,
      'paper',
    );
    for (let i = 0; i < 5; i++) path(c, `M-42 ${-56 + i * 9}q10-6 23-6`, undefined, '#617187', 1.3);
    paint(
      c,
      'M-10-97L-13-120 0-110Q15-118 26-107L37-120 35-94Q37-76 20-71Q0-69-10-86Z',
      '#a9b6c3',
      id,
      'paper',
    );
    path(c, 'M0-91Q7-105 17-98Q29-101 31-87L29-78 11-74 0-83Z', '#e4d4b5', '#566176', 0.5);
    for (const x of [8, 24]) {
      path(c, `M${x - 5}-91q5-5 10 0q-5 4-10 0Z`, '#f3e8c9', '#50566b', 0.5);
      ellipse(c, x + 1, -91, 1.5, 2.3, '#34394b');
    }
    path(c, 'M17-88v7l-4 1M12-77q5 2 10 0', undefined, '#626478', 0.65);
    ellipse(c, 5, -82, 2.8, 2.8, '#bd9e91');
    ellipse(c, 27, -82, 2.8, 2.8, '#bd9e91');
    const paw = Math.sin(time * 2) * 2;
    path(c, `M13-58Q30-67 31 ${-48 + paw}H15Z`, '#a9b6c3', '#556174', 0.9);
    line(c, 26, -47 + paw, 30, -24, '#a48755', 0.7);
    ellipse(c, 31, -22, 5, 6, '#53493b');
    ellipse(c, 30, -29, 2, 2, '#53493b');
    c.restore();
    return;
  }
  if (id === 'nouveau' || id === 'ukiyo') {
    const black = id === 'nouveau',
      color = black ? '#263c34' : '#eee4bd',
      ink = black ? '#1d3028' : '#304344';
    path(c, `M-31-7Q${-66 - sway} 4-61-22Q-56-35-49-27`, undefined, ink, 8);
    path(c, `M-31-7Q${-66 - sway} 4-61-22Q-56-35-49-27`, undefined, color, 5);
    const body = paint(
      c,
      'M-6-77Q-42-77-49-38Q-51-10-35-4H32Q38-15 24-42Q20-65-6-77Z',
      color,
      id,
      'paper',
    );
    if (!black) {
      c.save();
      c.clip(body);
      path(c, 'M-48-57Q-13-70-13-46Q-26-18-42-23Z', '#bd774d');
      path(c, 'M-25-32Q-9-45-3-29L-6-9-23-9Z', '#2e4240');
      path(c, 'M16-62Q34-58 34-37L19-31Z', '#ba754d');
      c.restore();
    }
    paint(c, 'M13-58Q19-35 18-9L29-4 34-7Q28-34 26-58Z', color, id, 'paper');
    for (let i = 0; i < 11; i++)
      path(c, `M${-37 + i * 6} -28q-4 9-1 20`, undefined, black ? '#71877660' : '#aeb29360', 0.5);
    c.save();
    c.translate(19, 0);
    c.rotate(Math.sin(time * 1.2) * 0.023);
    const head = paint(
      c,
      'M-22-103L-24-127-9-114Q4-121 20-112L33-127 34-101Q35-84 20-77Q0-71-16-86Q-25-92-22-103Z',
      color,
      id,
      'paper',
    );
    if (!black) {
      c.save();
      c.clip(head);
      path(c, 'M-25-129L1-124 2-95-23-89Z', '#bb764c');
      path(c, 'M20-128H36V-98L22-105Z', '#283c3c');
      c.restore();
    }
    for (const x of [-5, 19]) {
      path(c, `M${x - 6}-98q6-4 12 0q-6 5-12 0Z`, black ? '#b9b359' : '#b8b484', ink, 0.6);
      ellipse(c, x + 1, -98, 1, 2.4, ink);
    }
    path(c, 'M0-88q4-2 8 0l-4 4Z', black ? '#797154' : '#b77a68');
    path(c, 'M4-84q-4 4-9 1M4-84q4 5 10 0', undefined, black ? '#a2a782' : '#445249', 0.6);
    for (let i = 0; i < 3; i++) {
      line(c, -6, -83 + i * 2, -28, -87 + i * 5, black ? '#a6b18c' : '#3e5047', 0.4);
      line(c, 18, -83 + i * 2, 39, -87 + i * 5, black ? '#a6b18c' : '#3e5047', 0.4);
    }
    path(c, 'M-11-73Q8-63 29-77', undefined, black ? '#b06445' : '#a96949', 3);
    if (black) ellipse(c, 14, -68, 2, 3, '#c4a352', ink, 0.5);
    c.restore();
    c.restore();
    return;
  }
  const post = id === 'post',
    ink = post ? '#234b73' : '#ab8865',
    color = post ? '#d8a13c' : '#e5b46b';
  path(c, `M-31-7C${-68 - sway} 3-75-26-57-28Q-46-24-55-15`, undefined, ink, 8);
  path(c, `M-31-7C${-68 - sway} 3-75-26-57-28Q-46-24-55-15`, undefined, color, 5);
  const body = path(
    c,
    'M-9-78Q-43-76-49-40Q-53-11-34-4H31Q38-16 25-45Q18-71-9-78Z',
    color,
    ink,
    1.2,
  );
  impasto(
    c,
    body,
    [-51, -84, 90, 85],
    post
      ? ['#dca944', '#edcc64', '#a86635', '#d0b863', '#946b33']
      : ['#e8ba6e', '#f1d097', '#c7945a', '#ecd8a5', '#d59864'],
    1000,
    192,
    (x, y) => Math.atan2(y + 39, x + 20) + Math.PI / 2,
  );
  for (let r = 5; r < 31; r += 4)
    path(
      c,
      `M${-19 + r} -39a${r} ${r * 0.83} 0 1 1-3-8`,
      undefined,
      post ? (r % 3 ? '#ecc357' : '#945c32') : '#c59457',
      post ? 1.6 : 0.7,
    );
  const leg = path(c, 'M18-56Q21-30 20-9L29-4 34-7Q30-35 28-57Z', '#d7a14d', ink, 0.8);
  impasto(c, leg, [17, -59, 18, 58], ['#f2cc83', '#a97442', '#d5ae68'], 150, 182);
  c.save();
  c.translate(19, 0);
  c.rotate(Math.sin(time * 1.2) * 0.023);
  const head = path(
    c,
    'M-22-103L-24-126-10-113Q4-122 20-112L33-127 34-101Q36-83 20-77Q0-71-16-86Q-25-92-22-103Z',
    color,
    ink,
    1.2,
  );
  impasto(
    c,
    head,
    [-25, -129, 65, 56],
    post
      ? ['#e9c353', '#bd8541', '#ecd17b', '#cc9c3f']
      : ['#f2c884', '#d59f6a', '#eee0bc', '#c9975b'],
    480,
    831,
    (x, y) => Math.atan2(y + 100, x - 3) + Math.PI / 2,
  );
  path(c, 'M-18-119l7 6-8 6Z', '#d28872');
  path(c, 'M23-113l8-7-2 13Z', '#cf8e71');
  for (const x of [-5, 20]) {
    ellipse(c, x, -98, 5.6, 6, post ? '#d2c748' : '#c6c895', ink, 0.9);
    ellipse(c, x + 1, -98, 1.6, 4, '#3d5860');
    ellipse(c, x + 2, -99.5, 0.7, 1, '#fff3cf');
  }
  path(c, 'M0-88q5-3 8 0l-4 4Z', '#a96a56', ink, 0.5);
  path(c, 'M4-84q-4 5-9 2M4-84q4 6 10 0', undefined, ink, 0.7);
  for (let i = 0; i < 3; i++) line(c, 18, -83 + i * 3, 42, -87 + i * 6, '#f8e6c4', 0.45);
  c.restore();
  c.restore();
}
