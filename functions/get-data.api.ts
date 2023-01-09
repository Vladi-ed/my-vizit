export const onGetRequest: PagesFunction<string> = async ({ request }) => {
  const urlPrams = new URLSearchParams(request.url);
  if (!urlPrams.has('service')) return new Response('Please provide service name');


  if (urlPrams.get('service') === 'aliya') {
    const serviceId = urlPrams.get('serviceId') || 9981; // Aliya benefits (Юля Ардити)
    // const serviceId = 5121; // Absorbtion basket, Bank account (Alisia Waxler)

    // const serviceId = 3123; // betuah leumi allowances  (ramat gan)
    // const serviceId = 3105; // betuah leumi allowances (tel-aviv)

    const cookie = request.headers.get('Cookie') || '';

    const respDatesResults = await searchAvailableDates(serviceId, cookie);
    if (!respDatesResults) return new Response('Token expired or empty');

    console.log('first results:', respDatesResults);
    const firstCalendarId = respDatesResults[0].calendarId;


    let timeArrayResults = await searchAvailableSlots(firstCalendarId, serviceId , cookie);
    // console.log(timeArray);
    if (timeArrayResults?.length === 0) timeArrayResults = await searchAvailableSlots(respDatesResults[1].calendarId, serviceId , cookie);


    const newTimeArr = timeArrayResults?.map(obj => String(obj.Time / 60).replace('.5', ':30'))
    console.log(newTimeArr);

    return new Response(JSON.stringify({date: respDatesResults[0].calendarDate.split('T').shift(), newTimeArr}))


  }
  else if (urlPrams.get('service') === 'passport') {


    // console.log(await respDates.json());


    const respLocations = await fetch("https://central.myvisit.com/CentralAPI/LocationSearch?currentPage=1&orderBy=Distance&organizationId=56&position=%7B%22lat%22:%2231.7272%22,%22lng%22:%2234.9996%22,%22accuracy%22:1440%7D&serviceTypeId=156", {
      "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en",
        "application-api-key": "8640a12d-52a7-4c2a-afe1-4411e00e3ac4",
        "application-name": "myVisit.com v3.5",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "cookie": "rbzsessionid=6c2514bec619b4d0b4f9b1fedce2325e; mvlng=en; mvcnm=Israel; mvcid=1; mvcc=il; GCLB=COvQjvqO-LyQ0gE; rbzid=PRV3vlnCcaAf+hMhKWrqUfkLKOTNxUXmqoFNjxsH9DtR3J2JgDgaYKIJdMqUhnBClnRYrZDGV7Xm0wuNbSHbIhbV63d9pYmyWfTGYOD6ILc0NoraXMvgpve13yLIi5ozpGI8Ftp0psFK3VfDbKtiXnBAEL7BFtslAfZkNOzQP915rg+Vcj9q/YiYUBVRroDQkWgLx+ToqxmGlQ0eL8VF/2Oy6bghN28MQ0WmyfO0Hh4=; _gid=GA1.2.522615553.1673114473; ARRAffinity=b1ef89074c71e161dc4fc9e1fb894062be585b15fd3db58dcfd3dfb656c73999; ARRAffinitySameSite=b1ef89074c71e161dc4fc9e1fb894062be585b15fd3db58dcfd3dfb656c73999; CentralJWTCookie=jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im92VFc2ckQ4ZmExM1V1cUdKT1BQNkFqa2NMQSJ9.eyJpc3MiOiJodHRwOi8vY2VudHJhbC5xbm9teS5jb20iLCJhdWQiOiJodHRwOi8vY2VudHJhbC5xbm9teS5jb20iLCJuYmYiOjE2NzMxNjc1MDgsImV4cCI6MTY3MzE3MTEwOCwidW5pcXVlX25hbWUiOiI0YWRkNWYxNC04NDhlLTQzMGUtYjE3NC04ZDVhN2M1MDE2OTQiLCJ1aWQiOiJHb2dIRXlGR0kyZitVdGFOWGZIVDFRPT0ifQ.GrQX66XTcpuPGwURnDo9RUD3GKm3nZpiTo6GzybTCjr1jFjm8_KMlmMXTw4EFzFIgZ-51vk68r9MfyUaMU5coXgiWvnqX5EwJeQT7ANRjkdib2hqTYpSXmkvdKTsgCgqTYuKkVPS7KzXdkfKfD8UHJQDC2EDWuhzFDYkumzx9fCxG3ZOL1SkzufpP4H5IR3egIDGnchKvKuzuB2cVYlpLIv0g-9TJ8V1HZdGVPXx_bpsV37fO1WC_OzAbot5CwOY6HX0gARgNsmkz9z5_ghLGCtk3CzHXLbOsAdNasiYReUlBrrWn0R0HlOyRwVGACkyc-YNRoGMj__36UBBdiSLlA",
        "Referer": "https://myvisit.com/",
        "Referrer-Policy": "no-referrer-when-downgrade"
      }
    });

    // console.log(await respLocations.json());

    return new Response(await respLocations.text());
  }
  else return new Response('Please provide service name');

//   const bookAppt = await fetch("https://central.myvisit.com/CentralAPI/AppointmentSet?ServiceId=5121&appointmentDate=2023%2F2%2F26&appointmentTime=600&position=%7B%22lat%22:%2232.0759%22,%22lng%22:%2234.8215%22,%22accuracy%22:1440%7D&preparedVisitId=136254053", {
//     "headers": {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0",
//         "Accept": "application/json, text/plain, */*",
//         "Accept-Language": "en",
//         "Application-Name": "myVisit.com v3.5",
//         "Application-API-Key": "8640a12d-52a7-4c2a-afe1-4411e00e3ac4",
//         "PreparedVisitToken": "3810e58e-dc4e-44e9-b4e7-a2f61be7ee4f"
//     }
// });



}


async function searchAvailableDates(serviceId: string | number, cookie: string) {
  const today = new Date().toISOString().split('T').shift();

  const data: { Results: { calendarId: number, calendarDate: string }[] } =
    await fetch("https://central.myvisit.com/CentralAPI/SearchAvailableDates?serviceId=" + serviceId + "&startDate=" + today, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
        "application-api-key": "8640a12d-52a7-4c2a-afe1-4411e00e3ac4",
        "application-name": "myVisit.com v3.5",
        "Origin": "https://myvisit.com",
        cookie
      }
    }).then(resp => resp.json());

  return data.Results;
}

async function searchAvailableSlots(calendarId: number, serviceId: string | number, cookie: string) {

  const respTime = await fetch("https://central.myvisit.com/CentralAPI/SearchAvailableSlots?CalendarId=" + calendarId + "&ServiceId=" + serviceId + "&dayPart=0", {
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "application-api-key": "8640a12d-52a7-4c2a-afe1-4411e00e3ac4",
      "application-name": "myVisit.com v3.5",
      "Origin": "https://myvisit.com",
      cookie
    }
  }).then(resp => resp.json()) as {Results: { Time: number }[]};

  return respTime.Results;
}
