// components/icons/StandardIcons.js

export const WhatsAppIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="#25D366" 
      d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"
    />
  </svg>
);

export const GmailIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="#EA4335" d="M20 6.5L12 12.5 4 6.5V18h16z" />
    <path fill="#34A853" d="M18 20h2v-4.5l-2-1.5z" />
    <path fill="#4285F4" d="M4 20h2v-4.5l-2-1.5z" />
    <path fill="#FBBC05" d="M20 18v-2l-2-1.5v3.5z" />
    <path fill="#C5221F" d="M18 14.5l-6 4.5-6-4.5v-6l6 4.5 6-4.5z" />
  </svg>
);

export const CallIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="#4CAF50" 
      d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.43-5.15-3.75-6.58-6.59l1.97-1.57c.26-.26.35-.65.24-1C9.13 6.42 8.93 5.23 8.93 4c0-.55-.45-1-1-1H4.37C3.65 3 3 3.8 3 4.79c.2 8.76 7.23 15.82 15.83 15.83 1.01 0 1.81-.66 1.81-1.38v-3.86c0-.55-.45-1-1-1z"
    />
  </svg>
);

export const TextIcon = ({ size = 32, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fill="#2196F3" 
      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
    />
  </svg>
);

// components/icons/ThreeDIcons.js

export const WhatsAppMinimalIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      d="M20.52 3.48A11.89 11.89 0 0 0 12 0C5.38 0 0 5.38 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.63A11.89 11.89 0 0 0 12 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.17-3.48-8.52zM12 22a9.87 9.87 0 0 1-5.06-1.38l-.36-.22-3.68.97.98-3.58-.24-.37A9.92 9.92 0 0 1 2 12C2 6.49 6.49 2 12 2a9.93 9.93 0 0 1 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.51-4.49 10-10 10z"
      fill="#25D366"
    />
    <path
      d="M17.47 14.37c-.3-.15-1.78-.88-2.06-.98-.28-.1-.49-.15-.7.15-.21.3-.82.98-1.01 1.18-.19.2-.36.23-.66.08-.3-.15-1.28-.47-2.44-1.47-.91-.81-1.53-1.81-1.72-2.11-.19-.3-.02-.47.14-.63.14-.13.32-.35.47-.52.15-.17.2-.26.3-.43.1-.17.06-.33-.02-.47-.08-.14-.67-1.62-.91-2.23-.24-.6-.49-.52-.67-.53-.17-.01-.37-.01-.57-.01s-.54.08-.83.38c-.29.3-1.09 1.06-1.09 2.57s1.12 2.95 1.27 3.16c.15.21 2.19 3.33 5.36 4.68.75.31 1.33.5 1.78.64.75.24 1.42.21 1.96.13.6-.09 1.78-.71 2.03-1.4.25-.69.25-1.28.17-1.4-.08-.12-.28-.2-.58-.35z"
      fill="#25D366"
    />
  </svg>
);

export const GmailMinimalIcon = ({ size = 22, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* White envelope base */}
    <path
      d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15C3.67 19 3 18.33 3 17.5v-11z"
      fill="#FFFFFF"
    />

    {/* Red M shape */}
    <path
      d="M4 7.2v9.6c0 .44.36.8.8.8h2.4V10l4 3.3 4-3.3v7.6h2.4c.44 0 .8-.36.8-.8V7.2l-6.4 5.2L4 7.2z"
      fill="#EA4335"
    />

    {/* Blue left fold */}
    <path
      d="M4 7.2l6.4 5.2V10L4 7.2z"
      fill="#4285F4"
    />

    {/* Green right fold */}
    <path
      d="M20 7.2l-6.4 5.2V10l6.4-2.8z"
      fill="#34A853"
    />

    {/* Yellow bottom accent */}
    <path
      d="M10.4 12.4L12 13.7l1.6-1.3-1.6 1-1.6-1z"
      fill="#FBBC05"
    />
  </svg>
);

export const PhoneCallMinimalIcon = ({ size = 32, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3.7.2 1.5.3 2.3.3.6 0 1 .4 1 1v3.4c0 .6-.4 1-1 1C10.4 20.6 3.4 13.6 3.4 5.8c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 .8.1 1.6.3 2.3.1.4 0 .8-.3 1.1l-2.2 2.2z"
      fill="#34A853"
    />
  </svg>
);

export const SmsMinimalIcon = ({ size = 32, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Message bubble */}
    <path
      d="M4 4.5C4 3.67 4.67 3 5.5 3h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H8l-4 4v-4.5C4 14.67 4 5.33 4 4.5z"
      fill="#1A73E8"
    />

    {/* Text lines */}
    <path
      d="M7 7.5h10M7 10h7"
      stroke="#FFFFFF"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const WhatsApp3DIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wa_3d_grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4CE484" />
        <stop offset="100%" stopColor="#128C7E" />
      </linearGradient>
    </defs>
    <path fill="url(#wa_3d_grad)" d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
  </svg>
);

export const Gmail3DIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gmail_3d_grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="100%" stopColor="#C92A2A" />
      </linearGradient>
    </defs>
    <path fill="url(#gmail_3d_grad)" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
  </svg>
);

export const Call3DIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="call_3d_grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#69F0AE" />
        <stop offset="100%" stopColor="#2E7D32" />
      </linearGradient>
    </defs>
    <path fill="url(#call_3d_grad)" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.43-5.15-3.75-6.58-6.59l1.97-1.57c.26-.26.35-.65.24-1C9.13 6.42 8.93 5.23 8.93 4c0-.55-.45-1-1-1H4.37C3.65 3 3 3.8 3 4.79c.2 8.76 7.23 15.82 15.83 15.83 1.01 0 1.81-.66 1.81-1.38v-3.86c0-.55-.45-1-1-1z"/>
  </svg>
);

export const Text3DIcon = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="text_3d_grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4FB3FF" />
        <stop offset="100%" stopColor="#0069C0" />
      </linearGradient>
    </defs>
    <path fill="url(#text_3d_grad)" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
  </svg>
);