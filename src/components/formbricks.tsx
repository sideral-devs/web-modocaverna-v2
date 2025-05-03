'use client'

import Script from 'next/script'

export default function FormbricksLoader() {
  return (
    <Script
      strategy="afterInteractive"
      id="formbricks-loader"
      dangerouslySetInnerHTML={{
        __html: `
          !function(){
            var t=document.createElement("script");
            t.type="text/javascript",t.async=!0;
            t.src="https://app.formbricks.com/js/formbricks.umd.cjs";
            t.onload=function(){  
              window.formbricks
                ? window.formbricks.setup({
                    environmentId: "cma7qvqv82gsfxe019xud5jl3",
                    appUrl: "https://app.formbricks.com"
                  })
                : console.error("Formbricks library failed to load properly. The formbricks object is not available.");
            };
            var e=document.getElementsByTagName("script")[0];
            e.parentNode.insertBefore(t,e);
          }();
        `,
      }}
    />
  )
}
