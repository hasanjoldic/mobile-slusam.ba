const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", 
				"Juli", "August", "September", "Oktober", "November", "Dezember"];

export const formatDate = (isoDate) => {
	const dateObj = new Date(isoDate);
	const day = dateObj.getDate();
	const month = months[dateObj.getMonth()];
	const year = dateObj.getFullYear();

	return `${day} ${month} ${year}`;
};

export const formatDateWithTime = isoDate => {
	const givenDate = formatDate(isoDate);
	const givenDateObj = new Date(isoDate);
	let hours = givenDateObj.getHours();
	if (hours < 10) {
		hours = "0" + hours;
	}
	let minutes = givenDateObj.getMinutes();
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	const time = `${hours}:${minutes}`;
	const todaysDateObj = new Date();
	const todaysDate = formatDate(todaysDateObj.toISOString());
	if (givenDate === todaysDate) {
		return `Heute ${time}`;
	}
	if (givenDateObj.getDate() === todaysDateObj.getDate() &&
	    givenDateObj.getMonth() === todaysDateObj.getMonth() &&
	    givenDateObj.getFullYear() === todaysDateObj.getFullYear()) {
		return `Gestern ${time}`;
	}
	return givenDate;

};

export const isBase64Bigger = (base64String, sizeInMB) => {
	const base64SizeInMB = base64String.length * 3 / 4 / 1000000; // eacht character represents 6 bits
	return base64SizeInMB > sizeInMB;
};

export const host = "http://localhost";
export const port = 8080;