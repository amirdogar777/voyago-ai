import { useState, useEffect } from "react";

import {
  Plane,
  Compass,
  MapPin,
  CalendarDays,
  CloudSun,
  Bookmark,
  Trash2,
  Sparkles,
  Search,
  ArrowRight,
  Wind,
  Download,
  Menu,
  X,
  Heart,
  Globe,
  CheckCircle,
  Plus,
  ExternalLink,
  Sun
} from "lucide-react";

// ========================================
// DESTINATION DATABASE
// ========================================

const destinations = [
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    lat: 35.6762,
    lon: 139.6503,
    hotel: 98,
    food: 37,
    transport: 18,
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000",
    activities: [
      "Explore Senso-ji Temple",
      "Discover Shibuya Crossing",
      "Visit Tokyo Skytree",
      "Enjoy traditional Japanese food",
      "Explore the Meiji Shrine",
      "Experience Akihabara"
    ]
  },
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    lat: 48.8566,
    lon: 2.3522,
    hotel: 138,
    food: 46,
    transport: 20,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1000",
    activities: [
      "Explore the Eiffel Tower",
      "Visit the Louvre Museum",
      "Walk along the Seine",
      "Discover Montmartre",
      "Enjoy French pastries",
      "Visit Luxembourg Gardens"
    ]
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    lat: -8.65,
    lon: 115.2167,
    hotel: 58,
    food: 24,
    transport: 12,
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1000",
    activities: [
      "Explore Ubud",
      "Visit beautiful beaches",
      "Discover traditional temples",
      "Explore tropical waterfalls",
      "Watch the sunset",
      "Visit rice terraces"
    ]
  },
  {
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    lat: 25.2048,
    lon: 55.2708,
    hotel: 116,
    food: 40,
    transport: 22,
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1000",
    activities: [
      "Visit Burj Khalifa",
      "Explore Dubai Mall",
      "Experience a desert safari",
      "Visit Dubai Marina",
      "Explore traditional markets",
      "Enjoy Jumeirah Beach"
    ]
  },
  {
    name: "Istanbul",
    country: "Turkey",
    region: "Europe",
    lat: 41.0082,
    lon: 28.9784,
    hotel: 68,
    food: 28,
    transport: 14,
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1000",
    activities: [
      "Explore Hagia Sophia",
      "Visit the Blue Mosque",
      "Take a Bosphorus cruise",
      "Explore the Grand Bazaar",
      "Try Turkish street food",
      "Visit Topkapi Palace"
    ]
  },
  {
    name: "Rome",
    country: "Italy",
    region: "Europe",
    lat: 41.9028,
    lon: 12.4964,
    hotel: 106,
    food: 39,
    transport: 17,
    image:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1000",
    activities: [
      "Visit the Colosseum",
      "Explore the Roman Forum",
      "Visit Vatican Museums",
      "Discover the Pantheon",
      "Explore Trastevere",
      "Enjoy authentic Italian food"
    ]
  }
];

const categories = [
  "Culture",
  "Food",
  "Adventure",
  "Nature",
  "Relaxation",
  "History",
  "Shopping"
];

// ========================================
// HELPER FUNCTIONS
// ========================================

const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return year + "-" + month + "-" + day;
}

function addDays(start, offset) {
  const date = new Date(start + "T12:00:00");
  date.setDate(date.getDate() + offset);
  return localDate(date);
}

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ========================================
// MAIN APPLICATION
// ========================================

export default function App() {

  // NAVIGATION
  const [page, setPage] = useState("Explore");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // DESTINATION SEARCH
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");

  const [destination, setDestination] =
    useState(destinations[0]);

  const [customCity, setCustomCity] = useState("");
  const [searchingCity, setSearchingCity] = useState(false);

  // WEATHER
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  // PLANNER
  const [startDate, setStartDate] = useState(localDate());
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(1);
  const [pace, setPace] = useState("Balanced");

  const [interests, setInterests] = useState([
    "Culture",
    "Food"
  ]);

  const [budget, setBudget] = useState(1200);

  // ITINERARY
  const [itinerary, setItinerary] = useState([]);
  const [activeDay, setActiveDay] = useState(0);

  // LOCAL STORAGE
  const [savedTrips, setSavedTrips] = useState(() =>
    readStorage("voyagoTrips")
  );

  const [favorites, setFavorites] = useState(() =>
    readStorage("voyagoFavorites")
  );

  // NOTIFICATIONS
  const [message, setMessage] = useState("");

  // ========================================
  // SAVE BROWSER DATA
  // ========================================

  useEffect(() => {
    localStorage.setItem(
      "voyagoTrips",
      JSON.stringify(savedTrips)
    );
  }, [savedTrips]);

  useEffect(() => {
    localStorage.setItem(
      "voyagoFavorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  // ========================================
  // LIVE WEATHER
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setWeather(null);
      setWeatherError("");

      try {
        const url =
          "https://api.open-meteo.com/v1/forecast" +
          "?latitude=" + destination.lat +
          "&longitude=" + destination.lon +
          "&current=temperature_2m,relative_humidity_2m," +
          "wind_speed_10m,weather_code";

        const response = await fetch(url, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Weather service unavailable");
        }

        const data = await response.json();

        if (!data.current) {
          throw new Error("Weather data unavailable");
        }

        setWeather(data.current);

      } catch (error) {
        if (error.name !== "AbortError") {
          setWeatherError(error.message);
        }
      }
    }

    fetchWeather();

    return () => controller.abort();

  }, [destination]);

  // ========================================
  // NOTIFICATION
  // ========================================

  function notify(text) {
    setMessage(text);
  }

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => clearTimeout(timer);
  }, [message]);

  // ========================================
  // NAVIGATION
  // ========================================

  function navigate(name) {
    setPage(name);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function selectDestination(city) {
    setDestination(city);
    setItinerary([]);
    navigate("Planner");
  }

  // ========================================
  // SEARCH ANY CITY
  // ========================================

  async function findCity(event) {
    event.preventDefault();

    if (!customCity.trim()) return;

    setSearchingCity(true);

    try {
      const url =
        "https://geocoding-api.open-meteo.com/v1/search" +
        "?name=" + encodeURIComponent(customCity.trim()) +
        "&count=1&language=en&format=json";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("City search unavailable");
      }

      const data = await response.json();

      if (!data.results?.length) {
        notify("City not found. Try another name.");
        return;
      }

      const city = data.results[0];

      const newDestination = {
        name: city.name,
        country: city.country,
        region: "Custom",
        lat: city.latitude,
        lon: city.longitude,
        hotel: 85,
        food: 35,
        transport: 18,
        image: "",
        activities: [
          "Explore " + city.name + " city center",
          "Visit famous local attractions",
          "Try traditional local food",
          "Explore historic landmarks",
          "Visit local shopping markets",
          "Discover scenic viewpoints"
        ]
      };

      selectDestination(newDestination);

      setCustomCity("");
      notify("Destination added successfully!");

    } catch (error) {
      notify(error.message);
    } finally {
      setSearchingCity(false);
    }
  }

  // ========================================
  // FAVORITE DESTINATIONS
  // ========================================

  function toggleFavorite(name) {
    setFavorites((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    );
  }

  // ========================================
  // BUDGET CALCULATOR
  // ========================================

  const estimates = {
    Hotel: destination.hotel * days,
    Food: destination.food * days * travelers,
    Transport: destination.transport * days * travelers,
    Activities: 25 * days * travelers
  };

  const totalCost = Object.values(estimates)
    .reduce((sum, value) => sum + value, 0);

  const balance = budget - totalCost;

  // ========================================
  // ITINERARY GENERATOR
  // ========================================

  function generateItinerary() {
    if (!startDate || startDate < localDate()) {
      notify("Please select a valid future date.");
      return;
    }

    const count =
      pace === "Relaxed" ? 2 :
      pace === "Packed" ? 4 : 3;

    const activities = [...destination.activities];

    if (interests.includes("Food")) {
      activities.push("Explore local restaurants");
    }

    if (interests.includes("Nature")) {
      activities.push("Explore parks and natural scenery");
    }

    if (interests.includes("Adventure")) {
      activities.push("Try a local outdoor adventure");
    }

    if (interests.includes("Shopping")) {
      activities.push("Visit popular shopping streets");
    }

    if (interests.includes("Relaxation")) {
      activities.push("Enjoy a relaxing afternoon");
    }

    if (interests.includes("History")) {
      activities.push("Discover a historical landmark");
    }

    const schedule = [];

    for (let day = 0; day < days; day++) {
      const activitiesToday = [];

      for (let slot = 0; slot < count; slot++) {
        const index =
          (day * count + slot) % activities.length;

        activitiesToday.push({
          time: [
            "09:00 AM",
            "12:00 PM",
            "03:00 PM",
            "06:00 PM"
          ][slot],
          title: activities[index]
        });
      }

      schedule.push({
        day: day + 1,
        date: addDays(startDate, day),
        activities: activitiesToday
      });
    }

    setItinerary(schedule);
    setActiveDay(0);

    notify("Your itinerary is ready!");

    setTimeout(() => {
      document
        .getElementById("itinerary")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  // ========================================
  // SAVE TRIP
  // ========================================

  function saveTrip() {
    if (!itinerary.length) {
      notify("Generate an itinerary first.");
      return;
    }

    const trip = {
      id: crypto.randomUUID(),
      destination,
      startDate,
      days,
      travelers,
      pace,
      interests: [...interests],
      budget,
      itinerary
    };

    setSavedTrips((current) => [
      trip,
      ...current
    ]);

    notify("Trip saved successfully!");
  }

  // ========================================
  // LOAD SAVED TRIP
  // ========================================

  function loadTrip(trip) {
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setDays(trip.days);
    setTravelers(trip.travelers);
    setPace(trip.pace);
    setInterests(trip.interests || []);
    setBudget(trip.budget);
    setItinerary(trip.itinerary);
    setActiveDay(0);

    navigate("Planner");
  }

  // ========================================
  // EXPORT TRAVEL PLAN
  // ========================================

  function exportItinerary() {
    if (!itinerary.length) return;

    const lines = [
      "VOYAGO TRAVEL PLANNER",
      "Designed & Developed by Amir Hussain Dogar",
      "",
      "Destination: " + destination.name,
      "Country: " + destination.country,
      "Start Date: " + startDate,
      "Duration: " + days + " days",
      "Travelers: " + travelers,
      "Estimated Cost: " + money(totalCost),
      ""
    ];

    itinerary.forEach((day) => {
      lines.push(
        "DAY " + day.day + " - " + day.date
      );

      day.activities.forEach((activity) => {
        lines.push(
          activity.time + ": " + activity.title
        );
      });

      lines.push("");
    });

    const content = lines.join("\n");

    const blob = new Blob([content], {
      type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "Voyago-" + destination.name + "-Trip.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // ========================================
  // FILTER DESTINATIONS
  // ========================================

  const filteredDestinations =
    destinations.filter((city) => {
      const searchMatch =
        (city.name + " " + city.country)
          .toLowerCase()
          .includes(search.toLowerCase());

      const regionMatch =
        region === "All" ||
        city.region === region ||
        (
          region === "Favorites" &&
          favorites.includes(city.name)
        );

      return searchMatch && regionMatch;
    });

  // ========================================
  // INTERACTIVE MAP URL
  // ========================================

  const mapUrl =
    "https://www.openstreetmap.org/export/embed.html" +
    "?bbox=" + (destination.lon - 0.07) +
    "," + (destination.lat - 0.04) +
    "," + (destination.lon + 0.07) +
    "," + (destination.lat + 0.04) +
    "&layer=mapnik" +
    "&marker=" + destination.lat +
    "," + destination.lon;

  const fullMapUrl =
    "https://www.openstreetmap.org/" +
    "?mlat=" + destination.lat +
    "&mlon=" + destination.lon +
    "#map=12/" + destination.lat +
    "/" + destination.lon;

  const navigation = [
    { name: "Explore", icon: Compass },
    { name: "Planner", icon: CalendarDays },
    { name: "Saved Trips", icon: Bookmark }
  ];

  // ========================================
  // WEBSITE INTERFACE
  // ========================================

  return (
    <div className={
      darkMode ? "app dark-mode" : "app"
    }>

      {/* ================================= */}
      {/* SIDEBAR                           */}
      {/* ================================= */}

      <aside className={
        "sidebar " + (menuOpen ? "open" : "")
      }>

        <div className="logo">
          <div className="logo-icon">
            <Plane size={23} />
          </div>

          <span>
            voya<span className="logo-accent">go.</span>
          </span>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav>
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={
                  "nav-item " +
                  (page === item.name ? "active" : "")
                }
                onClick={() => navigate(item.name)}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-promo">
            <Sparkles size={26} />

            <h3>
              Your next adventure starts here.
            </h3>

            <p>
              Discover destinations and plan
              unforgettable experiences.
            </p>

            <button
              onClick={() => navigate("Planner")}
            >
              Start planning
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="profile">

            <div className="avatar">
              A
            </div>

            <div>
              <strong>Amir</strong>
              <small>Developer & Creator</small>
            </div>

          </div>

        </div>
      </aside>

      {/* ================================= */}
      {/* MAIN CONTENT                      */}
      {/* ================================= */}

      <main className="main">

        {/* HEADER */}

        <header className="topbar">

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <div className="topbar-location">
            <Globe size={17} />
            Explore the world
          </div>

          <div className="topbar-right">

            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle dark mode"
              title="Change theme"
            >
              <Sun size={18} />
            </button>

            <div className="developer-badge">

              <div className="developer-icon">
                A
              </div>

              <div className="developer-info">
                <span>
                  DESIGNED & DEVELOPED BY
                </span>

                <strong>
                  Amir Hussain Dogar
                </strong>
              </div>

              <span className="developer-online" />

            </div>

          </div>

        </header>

        {/* ================================= */}
        {/* EXPLORE PAGE                      */}
        {/* ================================= */}

        {page === "Explore" && (
          <>

            {/* HERO SECTION */}

            <section className="hero">

              <div className="hero-content">

                <span className="eyebrow">
                  ✦ YOUR WORLD, YOUR JOURNEY
                </span>

                <h1>
                  The world is waiting.
                  <br />
                  <span>Where to next?</span>
                </h1>

                <p>
                  Discover extraordinary destinations,
                  plan your adventures and create
                  unforgettable memories.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => navigate("Planner")}
                >
                  Plan your adventure
                  <ArrowRight size={18} />
                </button>

              </div>

              <div className="hero-signature">
                ✦ A CREATION BY AMIR
              </div>

            </section>

            {/* STATISTICS */}

            <section className="stats">

              <div className="stat">

                <div className="stat-icon">
                  <Globe />
                </div>

                <div>
                  <h2>6+</h2>
                  <p>Featured destinations</p>
                </div>

              </div>

              <div className="stat">

                <div className="stat-icon">
                  <CalendarDays />
                </div>

                <div>
                  <h2>{savedTrips.length}</h2>
                  <p>Your saved trips</p>
                </div>

              </div>

              <div className="stat">

                <div className="stat-icon">
                  <Heart />
                </div>

                <div>
                  <h2>{favorites.length}</h2>
                  <p>Favorite places</p>
                </div>

              </div>

            </section>

            {/* DESTINATION HEADING */}

            <div className="section-header">

              <div>

                <span className="eyebrow dark">
                  HANDPICKED FOR YOU
                </span>

                <h2>
                  Explore destinations
                </h2>

                <p>
                  Find a destination for your
                  next adventure.
                </p>

              </div>

            </div>

            {/* SEARCH BAR */}

            <div className="search-bar">

              <Search size={20} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search destinations..."
              />

            </div>

            {/* DESTINATION FILTERS */}

            <div className="filters">

              {[
                "All",
                "Asia",
                "Europe",
                "Middle East",
                "Favorites"
              ].map((item) => (
                <button
                  key={item}
                  className={
                    region === item ? "selected" : ""
                  }
                  onClick={() => setRegion(item)}
                >
                  {item}
                </button>
              ))}

            </div>

            {/* DESTINATION CARDS */}

            <div className="destination-grid">

              {filteredDestinations.map((city) => (

                <article
                  className="destination-card"
                  key={city.name}
                >

                  <div className="card-image">

                    <img
                      src={city.image}
                      alt={city.name}
                    />

                    <button
                      className="favorite-btn"
                      aria-label={
                        "Toggle favorite " + city.name
                      }
                      onClick={() =>
                        toggleFavorite(city.name)
                      }
                    >
                      <Heart
                        size={19}
                        fill={
                          favorites.includes(city.name)
                            ? "#ff6487"
                            : "none"
                        }
                      />
                    </button>

                  </div>

                  <div className="destination-info">

                    <span>
                      <MapPin size={14} />
                      {city.country}
                    </span>

                    <h3>{city.name}</h3>

                    <div className="card-footer">

                      <small>
                        From {money(city.hotel)}/night
                      </small>

                      <button
                        onClick={() =>
                          selectDestination(city)
                        }
                      >
                        Explore
                        <ArrowRight size={16} />
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

            {filteredDestinations.length === 0 && (
              <p className="empty-text">
                No destinations found.
              </p>
            )}

            {/* BOTTOM CALL TO ACTION */}

            <section className="explore-bottom">

              <div>

                <span className="eyebrow">
                  PLAN SOMETHING AMAZING
                </span>

                <h2>
                  Have a destination in mind?
                </h2>

                <p>
                  Build your personalized itinerary
                  in just a few clicks.
                </p>

              </div>

              <button
                className="primary-btn"
                onClick={() => navigate("Planner")}
              >
                Create trip
                <ArrowRight size={17} />
              </button>

            </section>

          </>
        )}

        {/* ================================= */}
        {/* TRAVEL PLANNER                    */}
        {/* ================================= */}

        {page === "Planner" && (
          <>

            <div className="page-heading">

              <span className="eyebrow dark">
                YOUR PERSONAL TRAVEL ASSISTANT
              </span>

              <h1>
                Plan your next
                <span> adventure ✳</span>
              </h1>

              <p>
                Customize your trip, check live weather
                and generate a travel itinerary.
              </p>

            </div>

            <div className="planner-layout">

              <div className="planner-main">

                {/* DESTINATION SELECTION */}

                <section className="panel">

                  <div className="panel-heading">

                    <span className="step">01</span>

                    <div>
                      <h2>Choose your destination</h2>
                      <p>Where would you like to go?</p>
                    </div>

                  </div>

                  <div className="selected-city">

                    {destination.image && (
                      <img
                        src={destination.image}
                        alt={destination.name}
                      />
                    )}

                    <div>

                      <small>
                        YOUR DESTINATION
                      </small>

                      <h3>
                        {destination.name}
                      </h3>

                      <span>
                        <MapPin size={14} />
                        {destination.country}
                      </span>

                    </div>

                  </div>

                  <label className="field">

                    <span>
                      Featured destinations
                    </span>

                    <select
                      value={
                        destinations.some(
                          (d) =>
                            d.name === destination.name
                        )
                          ? destination.name
                          : ""
                      }
                      onChange={(e) => {
                        const city =
                          destinations.find(
                            (d) =>
                              d.name === e.target.value
                          );

                        if (city) {
                          setDestination(city);
                          setItinerary([]);
                        }
                      }}
                    >

                      {!destinations.some(
                        (d) =>
                          d.name === destination.name
                      ) && (
                        <option value="">
                          Custom destination
                        </option>
                      )}

                      {destinations.map((city) => (
                        <option
                          key={city.name}
                          value={city.name}
                        >
                          {city.name}
                        </option>
                      ))}

                    </select>

                  </label>

                  {/* CUSTOM CITY SEARCH */}

                  <form
                    className="city-search"
                    onSubmit={findCity}
                  >

                    <Search size={18} />

                    <input
                      value={customCity}
                      onChange={(e) =>
                        setCustomCity(e.target.value)
                      }
                      placeholder="Search any other city..."
                    />

                    <button
                      type="submit"
                      disabled={searchingCity}
                    >
                      {searchingCity
                        ? "Searching..."
                        : "Search"}
                    </button>

                  </form>

                </section>

                {/* PERSONALIZE TRIP */}

                <section className="panel">

                  <div className="panel-heading">

                    <span className="step">02</span>

                    <div>
                      <h2>Personalize your trip</h2>
                      <p>
                        Tell us about your adventure.
                      </p>
                    </div>

                  </div>

                  <div className="form-grid">

                    <label className="field">

                      <span>Start date</span>

                      <input
                        type="date"
                        min={localDate()}
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setItinerary([]);
                        }}
                      />

                    </label>

                    <label className="field">

                      <span>Duration</span>

                      <select
                        value={days}
                        onChange={(e) => {
                          setDays(Number(e.target.value));
                          setItinerary([]);
                        }}
                      >

                        {Array.from(
                          { length: 14 },
                          (_, index) => index + 1
                        ).map((n) => (
                          <option
                            key={n}
                            value={n}
                          >
                            {n} days
                          </option>
                        ))}

                      </select>

                    </label>

                    <label className="field">

                      <span>Travelers</span>

                      <select
                        value={travelers}
                        onChange={(e) =>
                          setTravelers(
                            Number(e.target.value)
                          )
                        }
                      >

                        {Array.from(
                          { length: 8 },
                          (_, index) => index + 1
                        ).map((n) => (
                          <option
                            key={n}
                            value={n}
                          >
                            {n} travelers
                          </option>
                        ))}

                      </select>

                    </label>

                    <label className="field">

                      <span>Travel pace</span>

                      <select
                        value={pace}
                        onChange={(e) => {
                          setPace(e.target.value);
                          setItinerary([]);
                        }}
                      >

                        <option>Relaxed</option>
                        <option>Balanced</option>
                        <option>Packed</option>

                      </select>

                    </label>

                  </div>

                  {/* INTERESTS */}

                  <h3 className="field-title">
                    Your interests
                  </h3>

                  <div className="interests">

                    {categories.map((interest) => (

                      <button
                        key={interest}
                        className={
                          interests.includes(interest)
                            ? "chosen"
                            : ""
                        }
                        onClick={() => {
                          setInterests((current) =>
                            current.includes(interest)
                              ? current.filter(
                                  (i) => i !== interest
                                )
                              : [
                                  ...current,
                                  interest
                                ]
                          );

                          setItinerary([]);
                        }}
                      >
                        {interest}
                      </button>

                    ))}

                  </div>

                </section>

                {/* BUDGET CALCULATOR */}

                <section className="panel">

                  <div className="panel-heading">

                    <span className="step">03</span>

                    <div>
                      <h2>Travel budget</h2>
                      <p>
                        Calculate estimated expenses.
                      </p>
                    </div>

                  </div>

                  <div className="budget-top">

                    <span>Your budget</span>

                    <strong>
                      {money(budget)}
                    </strong>

                  </div>

                  <input
                    className="budget-range"
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={budget}
                    onChange={(e) =>
                      setBudget(
                        Number(e.target.value)
                      )
                    }
                  />

                  <div className="budget-items">

                    {Object.entries(estimates).map(
                      ([name, value]) => (

                        <div key={name}>

                          <span>{name}</span>

                          <strong>
                            {money(value)}
                          </strong>

                        </div>

                      )
                    )}

                    <div className="budget-total">

                      <span>
                        Estimated total
                      </span>

                      <strong>
                        {money(totalCost)}
                      </strong>

                    </div>

                  </div>

                  <div
                    className={
                      "budget-result " +
                      (balance < 0 ? "over" : "")
                    }
                  >

                    <span>
                      {balance < 0
                        ? "Over budget"
                        : "Remaining budget"}
                    </span>

                    <strong>
                      {money(Math.abs(balance))}
                    </strong>

                  </div>

                  <p className="disclaimer">
                    Illustrative USD estimates only.
                    Flights, visas and insurance
                    are excluded.
                  </p>

                </section>

                {/* GENERATE BUTTON */}

                <button
                  className="generate-btn"
                  onClick={generateItinerary}
                >

                  <Sparkles size={20} />

                  Generate my itinerary

                  <ArrowRight size={20} />

                </button>

                {/* GENERATED ITINERARY */}

                {itinerary.length > 0 && (

                  <section
                    className="panel"
                    id="itinerary"
                  >

                    <div className="itinerary-heading">

                      <div>

                        <span className="eyebrow dark">
                          YOUR TRAVEL SCHEDULE
                        </span>

                        <h2>
                          {days} days in
                          {" "}
                          {destination.name}
                        </h2>

                        <p>
                          Your personalized sample itinerary
                        </p>

                      </div>

                      <div className="action-buttons">

                        <button
                          onClick={saveTrip}
                        >
                          <Bookmark size={16} />
                          Save
                        </button>

                        <button
                          onClick={exportItinerary}
                        >
                          <Download size={16} />
                          Export
                        </button>

                      </div>

                    </div>

                    {/* DAY TABS */}

                    <div className="day-tabs">

                      {itinerary.map(
                        (day, index) => (

                          <button
                            key={day.day}
                            className={
                              activeDay === index
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setActiveDay(index)
                            }
                          >
                            Day {day.day}
                          </button>

                        )
                      )}

                    </div>

                    {/* TIMELINE */}

                    <div className="timeline">

                      {itinerary[activeDay]
                        ?.activities.map(
                          (activity, index) => (

                            <div
                              className="timeline-item"
                              key={index}
                            >

                              <div className="timeline-dot">
                                {index + 1}
                              </div>

                              <div>

                                <small>
                                  {activity.time}
                                </small>

                                <h3>
                                  {activity.title}
                                </h3>

                              </div>

                            </div>

                          )
                        )}

                    </div>

                    <p className="disclaimer">
                      This itinerary is generated
                      locally using sample activities.
                      Verify opening hours, travel
                      times and availability.
                    </p>

                  </section>

                )}

              </div>

              {/* ================================= */}
              {/* PLANNER RIGHT SIDEBAR             */}
              {/* ================================= */}

              <div className="planner-side">

                {/* LIVE WEATHER */}

                <section className="weather-card">

                  <div className="weather-label">
                    <CloudSun size={19} />
                    LIVE WEATHER
                  </div>

                  <h2>
                    {destination.name}
                  </h2>

                  {weather ? (

                    <>

                      <div className="temperature">

                        <CloudSun size={42} />

                        <strong>
                          {Math.round(
                            weather.temperature_2m
                          )}°
                        </strong>

                        <span>C</span>

                      </div>

                      <div className="weather-details">

                        <span>
                          <Wind size={16} />
                          {weather.wind_speed_10m}
                          {" "}km/h
                        </span>

                        <span>
                          Humidity:
                          {" "}
                          {weather.relative_humidity_2m}%
                        </span>

                      </div>

                    </>

                  ) : (

                    <p>
                      {weatherError ||
                        "Loading live weather..."}
                    </p>

                  )}

                  <small>
                    Current conditions by Open-Meteo
                  </small>

                </section>

                {/* INTERACTIVE MAP */}

                <section className="panel map-panel">

                  <div className="map-heading">
                    <MapPin size={19} />
                    DESTINATION MAP
                  </div>

                  <iframe
                    title={
                      "Map of " + destination.name
                    }
                    src={mapUrl}
                    loading="lazy"
                  />

                  <a
                    href={fullMapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open full map
                    <ExternalLink size={15} />
                  </a>

                </section>

                {/* QUOTE */}

                <section className="quote-card">

                  <Plane size={32} />

                  <h2>
                    Collect moments.
                    <br />
                    Not just miles.
                  </h2>

                  <p>
                    Every destination has a story
                    waiting for you.
                  </p>

                </section>

              </div>

            </div>

          </>
        )}

        {/* ================================= */}
        {/* SAVED TRIPS PAGE                  */}
        {/* ================================= */}

        {page === "Saved Trips" && (
          <>

            <div className="page-heading">

              <span className="eyebrow dark">
                YOUR TRAVEL JOURNAL
              </span>

              <h1>
                Saved adventures
                <span> ✳</span>
              </h1>

              <p>
                All your saved travel plans
                in one place.
              </p>

            </div>

            {savedTrips.length === 0 ? (

              <div className="empty-state">

                <Bookmark size={50} />

                <h2>
                  No saved trips yet
                </h2>

                <p>
                  Create your first adventure
                  and save it here.
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate("Planner")
                  }
                >
                  <Plus size={17} />
                  Create new trip
                </button>

              </div>

            ) : (

              <div className="saved-grid">

                {savedTrips.map((trip) => (

                  <article
                    className="saved-card"
                    key={trip.id}
                  >

                    {trip.destination.image ? (

                      <img
                        src={trip.destination.image}
                        alt={trip.destination.name}
                      />

                    ) : (

                      <div className="saved-placeholder">
                        <Globe size={40} />
                      </div>

                    )}

                    <div className="saved-content">

                      <small>
                        {trip.days}-DAY ADVENTURE
                      </small>

                      <h2>
                        {trip.destination.name}
                      </h2>

                      <p>
                        <MapPin size={15} />
                        {trip.destination.country}
                      </p>

                      <p>
                        <CalendarDays size={15} />
                        {trip.startDate}
                      </p>

                      <div className="saved-actions">

                        <button
                          onClick={() =>
                            loadTrip(trip)
                          }
                        >
                          View trip
                          <ArrowRight size={16} />
                        </button>

                        <button
                          className="delete-btn"
                          aria-label="Delete trip"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Delete this trip?"
                              )
                            ) {
                              setSavedTrips(
                                (current) =>
                                  current.filter(
                                    (item) =>
                                      item.id !== trip.id
                                  )
                              );
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </>
        )}

        {/* ================================= */}
        {/* AMIR PERSONAL BRANDING FOOTER     */}
        {/* ================================= */}

        <footer className="amir-footer">

          <div className="footer-brand">

            <div className="footer-logo">
              A
            </div>

            <div>

              <h2>
                AMIR<span>.DEV</span>
              </h2>

              <p>
                Crafting Digital Experiences
              </p>

            </div>

          </div>

          <div className="footer-center">

            <span className="footer-dot" />

            Designed & developed by Amir

          </div>

          <div className="footer-credit">

            © {new Date().getFullYear()} Amir

            <span> • </span>

            All Rights Reserved

          </div>

        </footer>

      </main>

      {/* ================================= */}
      {/* NOTIFICATION                      */}
      {/* ================================= */}

      {message && (

        <div
          className="notification"
          role="status"
        >

          <CheckCircle size={19} />

          {message}

        </div>

      )}

    </div>
  );
}