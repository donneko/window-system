import { defineConfig } from "vitepress";
import typedocSidebar from "../api/typedoc-sidebar.json";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "tyoi-core",
    description: "Process-based plugin routing core.",
    base: "/tyoi-core/",
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [{ text: "Home", link: "/" }],

        sidebar: [
            {
                text: "説明",
                items: [{ text: "API ドキュメント", link: "/api/index.html" }],
            },
            {
                text: "APIドキュメント",
                collapsed: true,
                items: typedocSidebar,
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/donneko/tyoi-core" }],
    },
});
