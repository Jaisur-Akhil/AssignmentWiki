/** @format */

import React, { useState, useEffect, useImperativeHandle } from "react";
import axios from "axios";

import "react-dates/initialize";
import { DateRangePicker } from "react-dates";
import "react-dates/lib/css/_datepicker.css";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInLastOneDay, setSearchInLastOneDay] = useState(0);
  const [searchInLastOneHour, setSearchInLastOneHour] = useState(0);
  const [searchInLastNDays, setSearchInLastNDays] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  let x = new Date("1945/08/15");
  //Date range states
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  let [searchData, setSearchData] = useState({
    searchText: "",
    time: null,
  });

  useEffect(() => {
    const current = new Date();
    const date =
      current.getFullYear() +
      "-" +
      current.getMonth() +
      1 +
      "-" +
      current.getDate() +
      " " +
      current.getHours() +
      ":" +
      current.getMinutes() +
      ":" +
      current.getSeconds();

    setSearchData({
      searchText: search,
      time: date,
    });
  }, [search]);

  const searchesInLastOneDay = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8800/searchForLastDay");
      setSearchInLastOneDay(res.data.length);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchesInLastOneHour = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8800/searchForLastHour");
      setSearchInLastOneHour(res.data.length);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchesInnDays = async (e) => {
    e.preventDefault();
    try {
      var dateStart = new Date(startDate);
      var dateEnd = new Date(endDate);

      var dS = dateStart.getDate();
      var mS = dateStart.getMonth() + 1;
      var yS = dateStart.getFullYear();
      var dE = dateEnd.getDate();
      var mE = dateEnd.getMonth() + 1;
      var yE = dateEnd.getFullYear();
      var sendStartDate = yS + "-" + mS + "-" + dS;
      var sendEndDate = yE + "-" + mE + "-" + dE;
      const res = await axios.get(
        `http://localhost:8800/searchesInnDays/${sendStartDate}&${sendEndDate}`
      );
      setSearchInLastNDays(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("1---------");
    if (search == "") return;
    try {
      await axios
        .get(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`
        )
        .then((res) => {
          console.log(res.data);
          setResults(res.data.query.search);
          setSearchInfo(res.data.query.searchinfo);
          axios.post("http://localhost:8800/search", searchData);
        });
    } catch (err) {
      console.log(err);
    }

    console.log(searchData);
  };

  return (
    <div className="App">
      <header>
        <h1>Akhil Assignment</h1>
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Explore here !! "
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        {searchInfo.totalhits ? <p>Results: {searchInfo.totalhits}</p> : ""}

        <button className="button" type="submit" onClick={searchesInLastOneDay}>
          No. of searches performed in last 1 day
        </button>
        <h3 style={{ margin: "20px" }}>{searchInLastOneDay}</h3>
        <button
          className="button"
          type="submit"
          onClick={searchesInLastOneHour}>
          No. of searches performed in last 1 Hour
        </button>
        <h3 style={{ margin: "20px" }}>{searchInLastOneHour}</h3>

        <DateRangePicker
          minDate={x}
          maxDate={startDate}
          startDate={startDate}
          startDateId="s_id"
          endDate={endDate}
          endDateId="e_id"
          onDatesChange={({ startDate, endDate }) => {
            setStartDate(startDate);
            setEndDate(endDate);
          }}
          focusedInput={focusedInput}
          onFocusChange={(e) => setFocusedInput(e)}
          displayFormat="DD/MM/YYYY"
          isOutsideRange={() => false}
        />

        <div className="mt-3 mb-1">
          Start Date: {startDate && startDate.format("ll")}
        </div>
        <div>End Date: {endDate && endDate.format("ll")}</div>
        <button className="button" type="submit" onClick={searchesInnDays}>
          Get Search Data
        </button>
      </header>
      <div className="results">
        {searchInLastNDays ? (
          <table className="tabless">
            <tr>
              <th>Sr. No</th>
              <th>Search Name</th>
              <th>Date</th>
            </tr>
            {searchInLastNDays.map((val, i) => {
              return (
                <tr key={i}>
                  <td>{val.pageid}</td>
                  <td>{val.searchText}</td>
                  <td>{new Date(val.time).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </table>
        ) : (
          <label></label>
        )}
      </div>
      <div className="results">
        {results.map((result, i) => {
          const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
          return (
            <div className="result" key={i}>
              <h3>{result.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: result.snippet }}></p>
              <a href={url} target="_blank" rel="noreferrer">
                Read more
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
