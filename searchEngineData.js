// Sections retained for visual grouping; each form now includes a `template` string
const sections = [
	{
		title: "General Search",
		forms: [
			{
				name: "Google",
				template: "https://www.google.com/search?q={q}",
				icon: "https://www.google.com/favicon.ico",
			},
			{
				name: "Yahoo",
				template: "https://search.yahoo.com/search?p={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://search.yahoo.com",
			},
			{
				name: "Bing",
				template: "https://www.bing.com/search?q={q}",
				icon: "https://www.bing.com/sa/simg/favicon-2x.ico",
			},
			{
				name: "Ecosia",
				template: "https://www.ecosia.org/search?q={q}",
				icon: "https://www.ecosia.org/favicon.ico",
			},
			{
				name: "Baidu",
				template: "https://www.baidu.com/s?wd={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://www.baidu.com",
			},
		],
	},
	{
		title: "AI Chatbots",
		forms: [
			{
				name: "ChatGPT",
				template: "https://chat.openai.com/?q={q}",
				icon: "https://chat.openai.com/favicon.ico",
			},
			{
				name: "Bing Chat",
				template: "https://www.bing.com/search?q={q}",
				icon: "https://www.bing.com/sa/simg/favicon-2x.ico",
			},
			{
				name: "Perplexity",
				template: "https://www.perplexity.ai/search?q={q}",
				icon: "https://www.perplexity.ai/favicon.ico",
			},
			{
				name: "You.com",
				template: "https://you.com/search?q={q}",
				icon: "https://you.com/favicon.ico",
			},
			{
				name: "Claude",
				template: "https://www.anthropic.com/claude?query={q}",
				icon: "https://www.anthropic.com/favicon.ico",
			},
		],
	},
	{
		title: "Privacy Search",
		forms: [
			{
				name: "DuckDuckGo",
				template: "https://duckduckgo.com/?q={q}",
				icon: "https://duckduckgo.com/favicon.ico",
			},
			{
				name: "Startpage",
				template: "https://www.startpage.com/sp/search?q={q}",
				icon: "https://www.startpage.com/favicon.ico",
			},
			{
				name: "Brave Search",
				template: "https://search.brave.com/search?q={q}",
				icon: "https://icons.duckduckgo.com/ip3/search.brave.com.ico",
			},
			{
				name: "Qwant",
				template: "https://www.qwant.com/?q={q}",
				icon: "https://icons.duckduckgo.com/ip3/qwant.com.ico",
			},
		],
	},
	{
		title: "Cloud & Productivity",
		forms: [
			{
				name: "Google Drive",
				template: "https://drive.google.com/drive/search?q={q}",
				icon: "https://www.gstatic.com/images/branding/product/2x/drive_48dp.png",
			},
			{
				name: "OneDrive",
				template: "https://onedrive.live.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=https://onedrive.live.com",
			},
		],
	},
	{
		title: "Social",
		forms: [
			{
				name: "YouTube",
				template: "https://www.youtube.com/results?search_query={q}",
				icon: "https://www.youtube.com/favicon.ico",
			},
			{
				name: "Twitter (X)",
				template: "https://x.com/search?q={q}",
				icon: "https://abs.twimg.com/favicons/twitter.3.ico",
			},
			{
				name: "Facebook",
				template: "https://www.facebook.com/search/top/?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=//www.facebook.com",
			},
			{
				name: "Instagram",
				template: "https://www.instagram.com/explore/tags/{q}/",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=//www.instagram.com",
			},
			{
				name: "Reddit",
				template: "https://www.reddit.com/search/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.reddit.com",
			},
			{
				name: "Pinterest",
				template: "https://www.pinterest.com/search/pins/?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.pinterest.com",
			},
			{
				name: "TikTok",
				template: "https://www.tiktok.com/search?q={q}",
				icon: "https://www.tiktok.com/favicon.ico",
			},
			{
				name: "LinkedIn",
				template: "https://www.linkedin.com/search/results/all/?keywords={q}",
				icon: "https://www.linkedin.com/favicon.ico",
			},
			{
				name: "Threads",
				template: "https://www.threads.net/search?q={q}",
				icon: "https://www.threads.net/favicon.ico",
			},
			{
				name: "Mastodon",
				template: "https://mastodon.social/search?q={q}",
				icon: "https://mastodon.social/favicon.ico",
			},
			{
				name: "Telegram",
				template: "https://t.me/s/{q}",
				icon: "https://telegram.org/favicon.ico",
			},
		],
	},
	{
		title: "Shopping",
		forms: [
			{
				name: "Amazon",
				template: "https://www.amazon.com/s?k={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.amazon.com",
			},
			{
				name: "eBay",
				template: "https://www.ebay.com/sch/i.html?_nkw={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.ebay.com",
			},
			{
				name: "Walmart",
				template: "https://www.walmart.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.walmart.com",
			},
		],
	},
	{
		title: "Utilities",
		forms: [
			{
				name: "Wikipedia",
				template: "https://en.wikipedia.org/w/index.php?search={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://www.wikipedia.org",
			},
			{
				name: "GitHub",
				template: "https://github.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://github.com",
			},
			{
				name: "Stack Overflow",
				template: "https://stackoverflow.com/search?q={q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://stackoverflow.com",
			},
			{
				name: "Google Maps",
				template: "https://www.google.com/maps/search/{q}",
				icon: "https://www.google.com/s2/favicons?domain_url=https://maps.google.com",
			},
			{
				name: "Google Scholar",
				template: "https://scholar.google.com/scholar?q={q}",
				icon: "https://www.google.com/s2/favicons?sz=24&domain_url=scholar.google.com",
			},
		],
	},
];

// Expose `sections` to the global scope for the renderer
window.sections = sections;
