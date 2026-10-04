import Head from "next/head";
import dynamic from "next/dynamic";

const AppWithoutSSR = dynamic(() => import("@/App"), { ssr: false });

export default function Home() {
    return (
        <>
            <Head>
                <title>Path of the Blind Sun - TGC Game Jam 2026</title>
                <meta name="description" content="An Action-Adventure Platformer / Souls-like game set in dark medieval India with an 18-page comic book structure, dynamic light mechanics, and elemental bosses." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main>
                <AppWithoutSSR />
            </main>
        </>
    );
}
