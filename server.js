//ten plik uruchamia serwer po skompilowaniu.
//Wciąż używamy Node'a do kompilacji. Express wykorzystuje właśnie funkcjonalności Node.js. 
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');

const app = express(); //W tym momencie tworzymy nową aplikację expressową i przypisujemy ją do stałej app. 
//Żeby później mieć do niej dostęp. app to po prostu odnośnik do naszego serwera.
// req to obiekt requestu (żądania), który będzie dostarczał nam informacje od użytkownika i o użytkowniku.
app.engine('.hbs', hbs());// informujemy Express o tym, że pliki o rozszerzeniu .hbs powinny być obsługiwane 
//przez silnik hbs (czyli nasz załadowany Handlebars).
app.set('view engine', '.hbs');//mówi, że w aplikacji używamy widoków właśnie o tym rozszerzeniu. Dzięki temu, 
//przy kompilacji, będziemy mogli wskazywać tylko jego nazwę, a Express sam domyśli się, że ma szukać pliku 
//z odpowiednią końcówką.

app.use(express.static(path.join(__dirname, '/public'))); //middleware express.static - pozwala udostępniać całe 
//foldery.
app.use(express.urlencoded({ extended: false }));//Jeśli chcesz umożliwić obsługę formularzy x-www-form-urlencoded, 
//dodaj middleware express.urlencoded.
app.use(express.json()); //Jeśli dodatkowo chcesz odbierać dane w formacie JSON (mogą być wysyłane za pomocą form-data), to również express.json.

app.post('/contact/send-message', (req, res) => {//Powyższy kod powinien zadziałać następująco: 
  //po wejściu pod link /contact/send-message (za pomocą metody POST), serwer powinien odczytać wysyłany przez 
  //użytkownika body i zwrócić go. 
  const { author, sender, title, message, design } = req.body;
  if(author && sender && title && message && design) {
    res.render('contact', { isSent: true, fileName: design });
  }
  else {
    res.render('contact', { isError: true });
  }
});
  //Poniżej routing podstron, ale teraz po stronie serwera.
app.get('/', (req, res) => { // endpoint pod link /, chodzi o połączenie za pomocą metody GET – do pobierania 
  //danych. Inne to: POST – do dodawania danych, PUT – do modyfikacji danych, DELETE – do usuwania danych. 
  //Dla POST byłoby to .post itd.
  //obiekt req zawiera informacje o użytkowniku, który łączy się z serwerem (jego przeglądarka, IP itp.) oraz 
  //o samym zapytaniu. Ma więc np. dostęp do danych wysyłanych wraz z zapytaniem (o ile użytkownik takie wysyłał).
  //obiekt res zawiera za to wiele przydatnych metod do komunikacji zwrotnej. Możemy wysłać np. komunikat tekstowy 
  //(metoda send), kod HTML (również send), dane w formacie JSON (metoda json) czy... nawet cały plik (metoda 
  //sendFile)! Istnieją tutaj również np. metody do zwracania kodów statusu np. 200, 404, 500. Teraz sami możemy 
  //zdecydować, kiedy "wyrzucimy" użytkownikowi błąd, a kiedy powiemy, że wszystko poszło dobrze.
  res.render('index'); //Parametry req, res dają nam dostęp do obiektu zapytania/żądania (ang. request) i odpowiedzi 
  //(ang. response).
}); //Metoda path.join stara się odpowiednio "skleić" ścieżkę bazową ze ścieżką docelową. Stała __dirname zwraca 
//adres aktualnej ścieżki. Dzięki niej nie będziemy musieli wpisywać, że skrypt aktualnie znajduje się np. 
//w lokalizacji C:\Kodilla\Test, tylko ustali to za każdym razem sam Node.js. W takiej sytuacji zmiana lokalizacji 
//projektu nie będzie nam straszna. Node po prostu zwróci pod __dirname nową ścieżkę i skrypt wciąż będzie działał.
// Czyli: znajdź plik index.html w folderze views, przy czym zacznij szukać w katalogu, w którym odpalono skrypt.
app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/history', (req, res) => {
  res.render('history');
});

app.get('/hello/:name', (req, res) => { //wczytaj szablon ./views/hello.hbs, podmień placeholder name na 
  //req.params.name, a na końcu zwróć już zmienioną treść jako odpowiedź dla klienta.
  res.render('hello', { name: req.params.name });//funkcja render nie wymaga ustawiania dokładnej ścieżki 
  //do pliku. Zamiast tego, domyślnie szuka ich w views. 
});

app.use((req, res) => {
  res.status(404).send('404 not found...'); //Jeśli serwer nie znajdzie pasującego endpointu, to w końcu trafi 
  //do middleware i pokaże klientowi odpowiedź 404 not found. Na pewno będzie wyglądał on lepiej niż domyślne 
  //Cannot GET /.
});

app.listen(8000, () => { //Kolejna część kodu mówi po prostu na jakim porcie chcemy utworzyć serwer HTTP. 
  //W naszym komputerze może być odpalonych wiele serwerów (chociażby webpack-dev-server) i aby możliwa była 
  //ich identyfikacja, wykorzystujemy właśnie mechanizm portów.
  console.log('Server is running on port: 8000'); //Jeśli port 8000 jest już zajęty, możesz ustawić tu inną 
  //wartość, np. 3000 albo 9000. Przykładowo Create React App, oficjalny szablon Reacta, wykorzystuje port 
  //3000 do uruchamiania podglądu aplikacji.
});