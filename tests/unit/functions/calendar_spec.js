global.moment = require("moment");

describe("Functions into modules/default/calendar/calendar.js", () => {
	// Fake for use by calendar.js
	Module = {};
	Module.definitions = {};
	Module.register = (name, moduleDefinition) => {
		Module.definitions[name] = moduleDefinition;
	};

	beforeAll(() => {
		// load calendar.js
		require("../../../modules/default/calendar/calendar");
	});

	describe("capFirst", () => {
		const words = {
			rodrigo: "Rodrigo",
			"123m": "123m",
			"magic mirror": "Magic mirror",
			",a": ",a",
			ñandú: "Ñandú"
		};

		Object.keys(words).forEach((word) => {
			it(`for '${word}' should return '${words[word]}'`, () => {
				expect(Module.definitions.calendar.capFirst(word)).toBe(words[word]);
			});
		});
	});

	describe("getLocaleSpecification", () => {
		it("should return a valid moment.LocaleSpecification for a 12-hour format", () => {
			expect(Module.definitions.calendar.getLocaleSpecification(12)).toEqual({ longDateFormat: { LT: "h:mm A" } });
		});

		it("should return a valid moment.LocaleSpecification for a 24-hour format", () => {
			expect(Module.definitions.calendar.getLocaleSpecification(24)).toEqual({ longDateFormat: { LT: "HH:mm" } });
		});

		it("should return the current system locale when called without timeFormat number", () => {
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: moment.localeData().longDateFormat("LT") } });
		});

		it("should return a 12-hour longDateFormat when using the 'en' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("en");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "h:mm A" } });
			moment.locale(localeBackup);
		});

		it("should return a 12-hour longDateFormat when using the 'au' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("au");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "h:mm A" } });
			moment.locale(localeBackup);
		});

		it("should return a 12-hour longDateFormat when using the 'eg' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("eg");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "h:mm A" } });
			moment.locale(localeBackup);
		});

		it("should return a 24-hour longDateFormat when using the 'nl' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("nl");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "HH:mm" } });
			moment.locale(localeBackup);
		});

		it("should return a 24-hour longDateFormat when using the 'fr' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("fr");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "HH:mm" } });
			moment.locale(localeBackup);
		});

		it("should return a 24-hour longDateFormat when using the 'uk' locale", () => {
			const localeBackup = moment.locale();
			moment.locale("uk");
			expect(Module.definitions.calendar.getLocaleSpecification()).toEqual({ longDateFormat: { LT: "HH:mm" } });
			moment.locale(localeBackup);
		});
	});

	describe("shorten", () => {
		const strings = {
			" String with whitespace at the beginning that needs trimming": { length: 16, return: "String with whit…" },
			"long string that needs shortening": { length: 16, return: "long string that…" },
			"short string": { length: 16, return: "short string" },
			"long string with no maxLength defined": { return: "long string with no maxLength defined" }
		};

		Object.keys(strings).forEach((string) => {
			it(`for '${string}' should return '${strings[string].return}'`, () => {
				expect(Module.definitions.calendar.shorten(string, strings[string].length)).toBe(strings[string].return);
			});
		});

		it("should return an empty string if shorten is called with a non-string", () => {
			expect(Module.definitions.calendar.shorten(100)).toBe("");
		});

		it("should not shorten the string if shorten is called with a non-number maxLength", () => {
			expect(Module.definitions.calendar.shorten("This is a test string", "This is not a number")).toBe("This is a test string");
		});

		it("should wrap the string instead of shorten it if shorten is called with wrapEvents = true (with maxLength defined as 20)", () => {
			expect(Module.definitions.calendar.shorten("This is a wrapEvent test. Should wrap the string instead of shorten it if called with wrapEvent = true", 20, true)).toBe(
				"This is a <br>wrapEvent test. Should wrap <br>the string instead of <br>shorten it if called with <br>wrapEvent = true"
			);
		});

		it("should wrap the string instead of shorten it if shorten is called with wrapEvents = true (without maxLength defined, default 25)", () => {
			expect(Module.definitions.calendar.shorten("This is a wrapEvent test. Should wrap the string instead of shorten it if called with wrapEvent = true", undefined, true)).toBe(
				"This is a wrapEvent <br>test. Should wrap the string <br>instead of shorten it if called <br>with wrapEvent = true"
			);
		});

		it("should wrap and shorten the string in the second line if called with wrapEvents = true and maxTitleLines = 2", () => {
			expect(Module.definitions.calendar.shorten("This is a wrapEvent and maxTitleLines test. Should wrap and shorten the string in the second line if called with wrapEvents = true and maxTitleLines = 2", undefined, true, 2)).toBe(
				"This is a wrapEvent and <br>maxTitleLines test. Should wrap and …"
			);
		});
	});
});
