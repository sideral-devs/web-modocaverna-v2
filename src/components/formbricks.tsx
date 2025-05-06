'use client'

import { useUser } from '@/hooks/queries/use-user'
import Script from 'next/script'

export default function FormbricksLoader() {
  const { data: user } = useUser()

  if (!user) return null

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
              if (window.formbricks) {
                window.formbricks.setup({
                  environmentId: "cma7qvqv82gsfxe019xud5jl3",
                  appUrl: "https://app.formbricks.com"
                });

                window.formbricks.setUserId("${user.id}");
                window.formbricks.setAttribute("email", ${user.email}");

                window.formbricks.identify("${user.id}", {
                  email: "${user.email}",
                  name: "${user.name}"
                });
              } else {
                console.error("Formbricks não está definido após carregar o script");
              }
            };
            var e=document.getElementsByTagName("script")[0];
            e.parentNode.insertBefore(t,e);
          }();
        `,
      }}
    />
  )
}
