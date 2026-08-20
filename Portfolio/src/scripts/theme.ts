export type Theme = "light" | "dark";

const storageKey = "portfolio-theme";
const themeQuery = "(prefers-color-scheme: dark)";

function isTheme(value: string | null): value is Theme {
	return value === "light" || value === "dark";
}

function readStoredTheme(): Theme | null {
	try {
		const storedTheme = window.localStorage.getItem(storageKey);
		return isTheme(storedTheme) ? storedTheme : null;
	} catch {
		return null;
	}
}

function systemTheme(): Theme {
	return window.matchMedia(themeQuery).matches ? "dark" : "light";
}

function updateThemeControls(theme: Theme): void {
	document.querySelectorAll<HTMLButtonElement>("[data-theme-toggle]").forEach((control) => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		control.setAttribute("aria-pressed", String(theme === "dark"));
		control.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
		control.title = `Switch to ${nextTheme} mode`;
	});
}

export function applyTheme(theme: Theme, persist = false): void {
	const root = document.documentElement;
	root.dataset.theme = theme;
	root.style.colorScheme = theme;

	if (persist) {
		try {
			window.localStorage.setItem(storageKey, theme);
		} catch {
			// Theme switching should still work when storage is unavailable.
		}
	}

	updateThemeControls(theme);
	window.dispatchEvent(new CustomEvent<Theme>("themechange", { detail: theme }));
}

export function currentTheme(): Theme {
	const activeTheme = document.documentElement.dataset.theme;
	return isTheme(activeTheme) ? activeTheme : readStoredTheme() ?? systemTheme();
}

export function toggleTheme(): Theme {
	const nextTheme = currentTheme() === "dark" ? "light" : "dark";
	applyTheme(nextTheme, true);
	return nextTheme;
}

export function initializeTheme(): () => void {
	applyTheme(currentTheme());

	const preference = window.matchMedia(themeQuery);
	const followSystemPreference = (event: MediaQueryListEvent): void => {
		if (readStoredTheme() === null) {
			applyTheme(event.matches ? "dark" : "light");
		}
	};

	preference.addEventListener("change", followSystemPreference);
	return () => preference.removeEventListener("change", followSystemPreference);
}
