import type { ReactNode } from "react";

type P = { className?: string };
const S = ({ className = "w-5 h-5", children }: P & { children: ReactNode }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export const ILogo = ({ className = "w-6 h-6" }: P) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <rect width="32" height="32" rx="7" fill="var(--acc)" fillOpacity="0.14" />
    <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="var(--acc)" strokeOpacity="0.4" />
    <path d="M7 23V9l5 7 4-7 4 7 5-7v14" stroke="var(--acc)" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IHome = (p: P) => (
  <S {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></S>
);
export const IUser = (p: P) => (
  <S {...p}><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5c1.2-3.6 4-5.4 7.5-5.4s6.3 1.8 7.5 5.4" /></S>
);
export const ITarget = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></S>
);
export const ITasks = (p: P) => (
  <S {...p}><rect x="3.5" y="4" width="17" height="16" rx="3" /><path d="m8 12 2.5 2.5L16 9" /></S>
);
export const IRocket = (p: P) => (
  <S {...p}><path d="M12 15.5c5.5-4 7.5-8 7-12-4-.5-8 1.5-12 7" /><path d="M7 10.5 4 12l3 1.5M13.5 17 12 20l-1.5-3" /><path d="m6.5 17.5-2 2" /><circle cx="14" cy="10" r="1.6" /></S>
);
export const ICode = (p: P) => (
  <S {...p}><path d="m8 8-4.5 4L8 16M16 8l4.5 4L16 16M13.2 6l-2.4 12" /></S>
);
export const IWallet = (p: P) => (
  <S {...p}><rect x="3" y="6" width="18" height="14" rx="3" /><path d="M3 10h18" /><circle cx="16.5" cy="14.5" r="1.1" fill="currentColor" stroke="none" /></S>
);
export const ITrend = (p: P) => (
  <S {...p}><path d="M3 17.5 9 11l4 4 7.5-8" /><path d="M15 6.5h5.5V12" /></S>
);
export const IBot = (p: P) => (
  <S {...p}><rect x="4.5" y="8" width="15" height="11" rx="3" /><path d="M12 8V4.5M9 4.5h6" /><circle cx="9.2" cy="13" r="1" fill="currentColor" stroke="none" /><circle cx="14.8" cy="13" r="1" fill="currentColor" stroke="none" /><path d="M9.5 16.2h5" /></S>
);
export const ISprout = (p: P) => (
  <S {...p}><path d="M12 21v-8" /><path d="M12 13c0-4-2.5-6.5-7-6.5 0 4.5 2.5 6.5 7 6.5Z" /><path d="M12 10.5c0-3 2-5 6.5-5 0 4-2 5.5-6.5 5.5" /></S>
);
export const IFolder = (p: P) => (
  <S {...p}><path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" /></S>
);
export const IChart = (p: P) => (
  <S {...p}><path d="M4 4v16h16" /><rect x="7.5" y="12" width="3" height="5" rx="0.6" /><rect x="12.5" y="8" width="3" height="9" rx="0.6" /><rect x="17.5" y="10.5" width="3" height="6.5" rx="0.6" /></S>
);
export const IPen = (p: P) => (
  <S {...p}><path d="m14.5 5 4.5 4.5L8 20.5l-5 1 1-5Z" /><path d="m12.5 7 4.5 4.5" /></S>
);
export const IGear = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="3.2" /><path d="M12 3.5v2.2M12 18.3v2.2M3.5 12h2.2M18.3 12h2.2M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18" /></S>
);
export const IChevD = (p: P) => <S {...p}><path d="m6 9 6 6 6-6" /></S>;
export const IChevR = (p: P) => <S {...p}><path d="m9 6 6 6-6 6" /></S>;
export const IPlus = (p: P) => <S {...p}><path d="M12 5v14M5 12h14" /></S>;
export const IMinus = (p: P) => <S {...p}><path d="M5 12h14" /></S>;
export const ITrash = (p: P) => (
  <S {...p}><path d="M4.5 6.5h15M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7M6.5 6.5 7.4 20h9.2l.9-13.5" /><path d="M10 10.5v6M14 10.5v6" /></S>
);
export const IX = (p: P) => <S {...p}><path d="m6 6 12 12M18 6 6 18" /></S>;
export const ICheck = (p: P) => <S {...p}><path d="m4.5 12.5 5 5L19.5 7" /></S>;
export const IMenu = (p: P) => <S {...p}><path d="M4 6.5h16M4 12h16M4 17.5h16" /></S>;
export const ICal = (p: P) => (
  <S {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></S>
);
export const IClock = (p: P) => <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></S>;
export const ILink = (p: P) => (
  <S {...p}><path d="M10 14a4 4 0 0 0 6 .5l3-3a4 4 0 1 0-5.7-5.6l-1.5 1.5" /><path d="M14 10a4 4 0 0 0-6-.5l-3 3a4 4 0 1 0 5.7 5.6l1.5-1.5" /></S>
);
export const IGithub = (p: P) => (
  <S {...p}><path d="M9 20.5v-3.2c-3.6 1-4.5-1.8-4.5-1.8-.5-1.3-1.2-1.7-1.2-1.7-1-.7 0-.7 0-.7 1.1 0 1.7 1.2 1.7 1.2 1 1.7 2.7 1.2 3.3 1 .1-.7.4-1.2.7-1.5-2.9-.3-5.8-1.4-5.8-6.4 0-1.4.5-2.5 1.3-3.4-.1-.4-.6-1.7.1-3.4 0 0 1.1-.4 3.5 1.3a11 11 0 0 1 6.4 0C20.9 1 22 1.4 22 1.4c.7 1.7.2 3 .1 3.4.8.9 1.3 2 1.3 3.4 0 5-3 6.1-5.8 6.4.5.4.9 1.2.9 2.4v3.3" /></S>
);
export const IExt = (p: P) => (
  <S {...p}><path d="M14 4.5h5.5V10M19.5 4.5 11 13" /><path d="M19.5 14v4a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" /></S>
);
export const IAlert = (p: P) => (
  <S {...p}><path d="M12 3.5 22 20H2Z" /><path d="M12 10v4.5" /><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" /></S>
);
export const IDownload = (p: P) => <S {...p}><path d="M12 3.5v11M7.5 10 12 14.5 16.5 10M4 19.5h16" /></S>;
export const IUpload = (p: P) => <S {...p}><path d="M12 14.5v-11M7.5 8 12 3.5 16.5 8M4 19.5h16" /></S>;
export const IEdit = (p: P) => (
  <S {...p}><path d="M4 20h4.5L20 8.5a2.1 2.1 0 0 0-3-3L5.5 17Z" /><path d="m14.5 7 3 3" /></S>
);
export const IFlame = (p: P) => (
  <S {...p}><path d="M12 21c3.9 0 6.5-2.5 6.5-6.2 0-2.6-1.6-4.4-3-6.3-1.2-1.6-2.4-3.3-2.5-5.5-3.1 1.8-4.4 4.5-4.1 7.3-.7-.3-1.3-1-1.5-2-1 1.3-1.9 3.2-1.9 5.3C5.5 18.5 8.1 21 12 21Z" /></S>
);
export const ICoin = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5v9M9.5 9.8c0-1 1.1-1.8 2.5-1.8s2.5.7 2.5 1.7c0 2.6-5 1.9-5 4.5 0 1 1.1 1.8 2.5 1.8s2.5-.8 2.5-1.8" /></S>
);
export const IBrain = (p: P) => (
  <S {...p}><path d="M9.5 4.5A2.7 2.7 0 0 0 6.8 7.2c-1.6.4-2.8 1.7-2.8 3.4 0 .9.3 1.7.9 2.3-.3.5-.4 1-.4 1.6 0 2.2 1.8 4 4 4 .3 1.3 1.4 2.3 2.8 2.3V4.5Z" /><path d="M14.5 4.5a2.7 2.7 0 0 1 2.7 2.7c1.6.4 2.8 1.7 2.8 3.4 0 .9-.3 1.7-.9 2.3.3.5.4 1 .4 1.6 0 2.2-1.8 4-4 4-.3 1.3-1.4 2.3-2.8 2.3" /></S>
);
export const IHeart = (p: P) => (
  <S {...p}><path d="M12 20.5S3.5 15.5 3.5 9.3A4.6 4.6 0 0 1 12 6.9a4.6 4.6 0 0 1 8.5 2.4c0 6.2-8.5 11.2-8.5 11.2Z" /></S>
);
export const IMoon = (p: P) => (
  <S {...p}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></S>
);
export const IBulb = (p: P) => (
  <S {...p}><path d="M9.5 18h5M10 21h4M12 3.5a6 6 0 0 1 3.5 10.9c-.8.6-1 1.4-1 2.1h-5c0-.7-.2-1.5-1-2.1A6 6 0 0 1 12 3.5Z" /></S>
);
export const IPlay = (p: P) => <S {...p}><path d="M8 5.5v13l10-6.5Z" /></S>;
export const IArrowR = (p: P) => <S {...p}><path d="M4 12h16M13.5 5.5 20 12l-6.5 6.5" /></S>;
export const IRefresh = (p: P) => (
  <S {...p}><path d="M20 12a8 8 0 1 1-2.3-5.6" /><path d="M20 3.5V8h-4.5" /></S>
);
export const IBook = (p: P) => (
  <S {...p}><path d="M4.5 5A2.5 2.5 0 0 1 7 2.5h12.5v16H7A2.5 2.5 0 0 0 4.5 21Z" /><path d="M4.5 18.5A2.5 2.5 0 0 1 7 16h12.5" /></S>
);
export const IStar = (p: P) => (
  <S {...p}><path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8Z" /></S>
);
export const IEye = (p: P) => (
  <S {...p}><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.8" /></S>
);
export const ICopy = (p: P) => (
  <S {...p}><rect x="8.5" y="8.5" width="12" height="12" rx="2" /><path d="M15.5 8.5v-3a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" /></S>
);
export const IInfo = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5" /><circle cx="12" cy="7.8" r="0.9" fill="currentColor" stroke="none" /></S>
);
export const ISun = (p: P) => (
  <S {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></S>
);
