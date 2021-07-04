async function getData(query, company, {model = require('../models/accessHistoryStatictis')}) {
    const action = query.action || 'year';
    delete query.action;
    const tDate = new Date();
    const utc = Date.UTC(tDate.getUTCFullYear(), tDate.getUTCMonth(), tDate.getUTCDate(), tDate.getUTCHours() + company.timeZone);
    const date = new Date(utc);
    let timeParent;
    switch (action) {
        case 'year':
            timeParent = date.getUTCFullYear() * 1000000;
            const months = await model.find({ ...query, timeParent }, '-timeParent').sort({ time: 1 });
            const dMonths = [];
            for (let month = 0; month < date.getUTCMonth() + 1; month++) {
                if (months.length > 0 && month === months[0].time.getUTCMonth()) {
                    dMonths.push(months.shift().toObject());
                    continue;
                }
                dMonths.push({
                    time: new Date(Date.UTC(date.getUTCFullYear(), month)),
                    employee: 0,
                    guest: 0,
                    unknown: 0,
                });
            }
            return dMonths;
        case 'month':
            timeParent = date.getUTCFullYear() * 1000000 + (date.getUTCMonth() + 1) * 10000;
            const days = await model.find({ ...query, timeParent }).sort({ time: 1 });
            const dDays = [];
            for (let day = 1; day < date.getUTCDate() + 1; day++) {
                if (days.length > 0 && day === days[0].time.getUTCDate()) {
                    dDays.push(days.shift().toObject());
                    continue;
                }
                dDays.push({
                    time: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), day)),
                    employee: 0,
                    guest: 0,
                    unknown: 0,
                });
            }
            return dDays;
        default:
            timeParent = date.getUTCFullYear() * 1000000 + (date.getUTCMonth() + 1) * 10000 + date.getDate() * 100;
            const hours = await model.find({ ...query, timeParent }).sort({ time: 1 });
            const dHours = [];
            for (let hour = 0; hour < date.getUTCHours() + 1; hour++) {
                if (hours.length > 0 && hour === hours[0].time.getUTCHours()) {
                    const h = hours.shift().toObject();
                    const t = new Date(h.time);
                    dHours.push({ ...h, time: new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), hour - company.timeZone)) });
                    continue;
                }
                dHours.push({
                    time: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), hour - company.timeZone)),
                    employee: 0,
                    guest: 0,
                    unknown: 0,
                });
            }
            return dHours;
    }
}

module.exports = {
    getData,
}