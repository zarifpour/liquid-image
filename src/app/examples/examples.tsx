import Image from 'next/image';

const imageDefaultSize = 100;

export function Examples() {
  return (
    <div className="grid grid-cols-5 items-center justify-center gap-4">
      <div>
        <a href="/share/01JMEE5EHV87C6HC4WBWXWWP7A?refraction=0.015&edgeBlur=0.2&patternBlur=0.005&liquid=0.1&speed=0.3&patternScale=2">
          <Image src="/examples/nike-logo.svg" alt="Nike Logo" width={imageDefaultSize} height={imageDefaultSize} />
        </a>
        Nike
      </div>

      <div>
        <a href="/share/01JMEE8FQ7MBWB6756HE0H2Z7X?edgeBlur=0.33">
          <Image
            src="/examples/starbucks-logo.svg"
            alt="Starbucks Logo"
            width={imageDefaultSize}
            height={imageDefaultSize}
          />
        </a>
        Starbucks
      </div>

      <div>
        <a href="/share/01JMEEH0248X4H30HHDJ0ZR82G">
          <Image
            src="/examples/instagram-logo.svg"
            alt="Instagram Logo"
            width={imageDefaultSize}
            height={imageDefaultSize}
          />
        </a>
        Instagram
      </div>

      <div>
        <a href="/share/01JMEEJ4D4FY78NAGM9KHFGC1P">
          <Image src="/examples/chrome-logo.png" alt="Chrome Logo" width={imageDefaultSize} height={imageDefaultSize} />
        </a>
        Chrome
      </div>

      <div>
        <a href="/share/01JMEEJT7W0GBQ8XSR1SJAGTTX">
          <Image src="/examples/vercel-logo.png" alt="Vercel Logo" width={imageDefaultSize} height={imageDefaultSize} />
        </a>
        Vercel
      </div>

      <div>
        <a href="/share/01JMEEKFBH30VFX1M2CNQCTN1Q?refraction=0.015&edgeBlur=0.3&patternBlur=0.005&liquid=0.1&speed=0.3&patternScale=2">
          <Image src="/examples/paper-logo.svg" alt="Paper Logo" width={imageDefaultSize} height={imageDefaultSize} />
        </a>
        Paper
      </div>

      <div>
        <a href="/share/01JMEENAEXX7XQPQ0S3TKH4MDW">
          <Image
            src="/examples/supabase-logo.png"
            alt="Supabase Logo"
            width={imageDefaultSize}
            height={imageDefaultSize}
          />
        </a>
        Supabase
      </div>

      <div>
        <Image src="/examples/figma-logo.svg" alt="Figma Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Figma
      </div>

      <div>
        <Image src="/examples/sketch-logo.svg" alt="Sketch Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Sketch
      </div>

      <div>
        <Image src="/examples/verge-logo.png" alt="The Verge Logo" width={imageDefaultSize} height={imageDefaultSize} />
        The Verge
      </div>

      <div>
        <Image src="/examples/adobe-logo.svg" alt="Adobe Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Adobe
      </div>

      <div>
        <Image
          src="/examples/basecase-logo.svg"
          alt="Basecase Logo"
          width={imageDefaultSize}
          height={imageDefaultSize}
        />
        Basecase
      </div>

      <div>
        <Image
          src="/examples/cloudflare-logo.svg"
          alt="Cloudflare Logo"
          width={imageDefaultSize}
          height={imageDefaultSize}
        />
        Cloudflare
      </div>

      <div>
        <Image src="/examples/discord-logo.svg" alt="Discord Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Discord
      </div>

      <div>
        <Image src="/examples/framer-logo.svg" alt="Framer Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Framer
      </div>

      <div>
        <Image
          src="/examples/mac-rumors-logo.svg"
          alt="Mac Rumors Logo"
          width={imageDefaultSize}
          height={imageDefaultSize}
        />
        MacRumors
      </div>

      <div>
        <Image
          src="/examples/radix-ui-logo.svg"
          alt="Radix UI Logo"
          width={imageDefaultSize}
          height={imageDefaultSize}
        />
        Radix UI
      </div>

      <div>
        <Image src="/examples/slack-logo.svg" alt="Slack Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Slack
      </div>

      <div>
        <Image src="/examples/framer-logo.svg" alt="Framer Logo" width={imageDefaultSize} height={imageDefaultSize} />
        Framer
      </div>

      <div>
        <Image
          src="/examples/techcrunch-logo.svg"
          alt="TechCrunch Logo"
          width={imageDefaultSize}
          height={imageDefaultSize}
        />
        TechCrunch
      </div>

      <div>
        <Image src="/examples/workos-logo.svg" alt="WorkOS Logo" width={imageDefaultSize} height={imageDefaultSize} />
        WorkOS
      </div>
    </div>
  );
}
