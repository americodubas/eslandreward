import React, { useEffect, useState } from "react";
import {
  Row,
  Layout,
  Button,
  Col,
  Typography,
  Tooltip,
  Space,
  Input,
} from "antd";
import { LoadingOutlined, RightOutlined } from "@ant-design/icons";
import "./App.css";
import average10 from "./assets/average10.json";
import average9 from "./assets/average9.json";

//Images
import RPImage from "./assets/regular_plots.png";
import SettlementImage from "./assets/settlement_plot.png";
import TownImage from "./assets/town_plot.png";
import CityImage from "./assets/city_plot.png";
import CapitalImage from "./assets/capital_plot.png";
import ESLogo from "./assets/logo@2x.png";
import SolarwoodImage from "./assets/sigil_solarwood.png";

const emptyCoordiante = { x: "", y: "" };

const MapComponent = React.memo(function Index({
  array,
  updateSelected,
  cleanSelected,
  localArea,
}) {
  return (
    <div className="map">
      {array.map((row, i) => {
        return (
          <div className="row" key={i}>
            {row.map((col, ii) => (
              <div
                key={i + "-" + ii}
                onClick={() => {
                  cleanSelected();
                  updateSelected({ loading: true });
                  setTimeout(() => {
                    const element = document.getElementById(`${col.index}`);
                    element.classList.add("selected");
                    for (let el of localArea(col.limits).filter(
                      (f) => f.index !== col.index
                    )) {
                      const element = document.getElementById(`${el.index}`);
                      if (element.classList[2] === "rp" && !element.classList.contains("guild")) {
                        element.classList.add("local");
                      }
                    }

                    updateSelected({ data: col, loading: false });
                  }, 200);
                }}
                id={col.index}
                className={
                  `${col.coordinates.x}-${col.coordinates.y}` +
                  (col.type === 0
                    ? " col rp"
                    : col.type === 1
                    ? " col settlements"
                    : col.type === 2
                    ? " col town"
                    : col.type === 3
                    ? " col city"
                    : col.type === 4
                    ? " col capital"
                    : "")
                }
              />
            ))}
          </div>
        );
      })}
    </div>
  );
});

function App() {
  const { Content } = Layout;
  const [map, setMap] = useState([]);
  const [info, setInfo] = useState({
    loading: false,
    data: undefined,
    top100: null,
    areaType: 21,
  });
  const [selectedCoordinates, setSelectedCoordinates] =
    useState(emptyCoordiante);

  const dataGuild = [
    { x: 21, y: 135, name: "Link" },
    { x: 23, y: 38, name: "FikaFlau" },
    { x: 26, y: 28, name: "Cacho" },
    { x: 29, y: 38, name: "Gabriel Paganini" },
    { x: 31, y: 37, name: "!Luvit" },
    { x: 44, y: 151, name: "Michael Braga" },
    { x: 48, y: 131, name: "gugakai" },
    { x: 52, y: 48, name: "Gaspar" },
    { x: 65, y: 182, name: "GUGAWARRIORS" },
    { x: 66, y: 180, name: "coelllho" },
    { x: 67, y: 96, name: "Unstoppablo" },
    { x: 67, y: 106, name: "Unstoppablo" },
    { x: 72, y: 22, name: "Kaizen" },
    { x: 73, y: 52, name: "Matheussao" },
    { x: 73, y: 151, name: "Nephalem" },
    { x: 76, y: 35, name: "Bazin" },
    { x: 86, y: 159, name: "LuigiGF" },
    { x: 87, y: 174, name: "IrmãoCaneca" },
    { x: 91, y: 21, name: "Diego" },
    { x: 93, y: 29, name: "gugakai" },
    { x: 93, y: 38, name: "MkO" },
    { x: 95, y: 171, name: "orok" },
    { x: 96, y: 55, name: "Nonakax" },
    { x: 96, y: 145, name: "Carvox" },
    { x: 99, y: 99, name: "sil" },
    { x: 99, y: 165, name: "Erissoncx" },
    { x: 103, y: 184, name: "Gutis007" },
    { x: 113, y: 162, name: "Cubano" },
    { x: 116, y: 179, name: "Zelele" },
    { x: 117, y: 117, name: "Nephalem" },
    { x: 119, y: 157, name: "CadãO" },
    { x: 119, y: 196, name: "DrowRanged" },
    { x: 120, y: 42, name: "Carvox" },
    { x: 124, y: 174, name: "gugakai" },
    { x: 127, y: 178, name: "gugakai" },
    { x: 136, y: 135, name: "ffffc" },
    { x: 143, y: 124, name: "Block182" },
    { x: 143, y: 164, name: "Slec" },
    { x: 143, y: 169, name: "GuardaCagão" },
    { x: 143, y: 177, name: "ZeusBebum" },
    { x: 143, y: 180, name: "Jean.Rodrigues" },
    { x: 144, y: 124, name: "Block182" },
    { x: 144, y: 164, name: "Riskof" },
    { x: 146, y: 154, name: "Block182" },
    { x: 148, y: 153, name: "Nonakax" },
    { x: 149, y: 168, name: "Gura" },
    { x: 150, y: 149, name: "Bolad0" },
    { x: 150, y: 160, name: "lipeta" },
    { x: 151, y: 176, name: "FelipeMGo" },
  ];

  const setGuild = () => {
    for (let el of dataGuild) {
      const element = document.getElementsByClassName(`${el.x}-${el.y}`);
      element[0].classList.add("guild");
    }
  };

  useEffect(() => {
    generateMap();
    //eslint-disable-next-line
  }, [info.top100, info.areaType]);

  useEffect(() => {
    setSelectedCoordinates(emptyCoordiante);
    //eslint-disable-next-line
  }, [info.data]);

  const generateMap = () => {
    let data = [...average10];
    if (info.areaType === 19) {
      data = [...average9];
    }
    const columns = [...Array(200).keys()].reverse().map((m) => {
      return data
        .filter((f) => f.coordinates.y === m)
        .sort((a, b) => a.coordinates.x - b.coordinates.x);
    });

    setTimeout(() => {
      setMap(columns);
      setSelectedCoordinates(emptyCoordiante);
      setGuild();
    }, 100);
  };

  const selectXCoordinate = (event) => {
    clearSelectedCoordinate();
    const newCoordinate = { ...selectedCoordinates, x: event.target.value };
    setSelectedCoordinates(newCoordinate);
  };

  const selectYCoordinate = (event) => {
    clearSelectedCoordinate();
    const newCoordinate = { ...selectedCoordinates, y: event.target.value };
    setSelectedCoordinates(newCoordinate);
  };

  const clearSelectedCoordinate = () => {
    if (info.data) {
      const element = document.getElementById(`${info.data.index}`);
      element.classList.remove("selected");
      for (let el of localArea(info.data.limits)) {
        const element = document.getElementById(`${el.index}`);
        element.classList.remove("local");
      }
    }
  };

  const searchCoordinate = () => {
    const elements = document.getElementsByClassName(
      `${selectedCoordinates.x}-${selectedCoordinates.y}`
    );
    for (let element of elements) {
      element.click();
    }
  };

  const localArea = (limits) => {
    let data = [...average10];
    if (info.areaType === 19) {
      data = [...average9];
    }
    return data.filter(
      (f) =>
        f.coordinates.x >= limits.left &&
        f.coordinates.x <= limits.right &&
        f.coordinates.y >= limits.bottom &&
        f.coordinates.y <= limits.top
    );
  };

  const showTop100 = (type) => {
    let data = [...average10];
    if (info.areaType === 19) {
      data = [...average9];
    }

    //Clean
    for (let el of data.filter(
      (f) => f.type === info.top100 && f.isTop100 === true
    )) {
      const element = document.getElementById(`${el.index}`);
      element.classList.remove("top");
    }
    if (info.top100 === -1) {
      for (let el of data.filter((f) => f.type === 0 && f.averageReward > 0)) {
        const element = document.getElementById(`${el.index}`);
        element.classList.remove("top");
      }
    }

    //Paint
    if (type === -1) {
      for (let el of data.filter((f) => f.type === 0 && f.averageReward > 0)) {
        const element = document.getElementById(`${el.index}`);
        element.classList.add("top");
      }
    } else {
      for (let el of data.filter(
        (f) => f.type === type && f.isTop100 === true
      )) {
        const element = document.getElementById(`${el.index}`);
        element.classList.add("top");
      }
    }

    setInfo({ ...info, top100: type });
  };

  return (
    <Layout className="layout body">
      <Content style={{ padding: "0 50px" }}>
        <Row
          className="row100 title"
          style={{ marginBottom: 20 }}
          align="middle"
          justify="space-between"
        >
          <span>
            <img src={ESLogo} style={{ width: 50 }} alt="plot" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ember Sword - Local Land Reward
            Scale (2.5%)
          </span>
          <span>
            Solarwood{" "}
            <img src={SolarwoodImage} style={{ width: 45 }} alt="plot" />
            &nbsp;&nbsp;
            <Button
              disabled={info.areaType === 21}
              type="primary"
              className={info.areaType === 21 ? "button selected" : "button"}
              onClick={() => {
                clearSelectedCoordinate();
                setMap([]);
                setInfo({
                  ...info,
                  data: undefined,
                  top100: null,
                  areaType: 21,
                });
              }}
            >
              21x21
            </Button>
            &nbsp;&nbsp;
            <Button
              disabled={info.areaType === 19}
              type="primary"
              className={info.areaType === 19 ? "button selected" : "button"}
              onClick={() => {
                clearSelectedCoordinate();
                setMap([]);
                setInfo({
                  ...info,
                  data: undefined,
                  top100: null,
                  areaType: 19,
                });
              }}
            >
              19x19
            </Button>
          </span>
        </Row>

        <Row style={{ width: "100%" }}>
          <Col className="colLeft">
            {map.length === 0 ? (
              <Row className="loading">
                <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
              </Row>
            ) : (
              <MapComponent
                cleanSelected={clearSelectedCoordinate}
                array={map}
                updateSelected={(e) => {
                  setInfo({ ...info, ...e });
                }}
                localArea={localArea}
              />
            )}
          </Col>

          <Col className="colRight">
            <Row style={{ width: "100%" }}>
              <Row style={{ marginTop: 0, width: "100%" }}>
                <Row
                  style={{ width: "100%", marginTop: 10, marginBottom: 20 }}
                  justify="center"
                >
                  <Space direction="horizontal">
                    <Input
                      value={selectedCoordinates.x}
                      placeholder="X"
                      min="0"
                      max="199"
                      type="number"
                      style={{ width: 80 }}
                      onPressEnter={searchCoordinate}
                      onChange={selectXCoordinate}
                    />
                    <Input
                      value={selectedCoordinates.y}
                      placeholder="Y"
                      min="0"
                      max="199"
                      type="number"
                      style={{ width: 80 }}
                      onPressEnter={searchCoordinate}
                      onChange={selectYCoordinate}
                    />
                    <Button
                      style={{ width: 80 }}
                      type="primary"
                      className="button"
                      onClick={searchCoordinate}
                    >
                      Search
                    </Button>
                  </Space>
                </Row>
                <Row className="row100 title" justify="center" align="middle">
                  <div className="col guild"></div>
                  &nbsp;Land EHiSTO
                </Row>
                <Row className="row100 title" justify="center" align="middle">
                  Top Reward Filter
                </Row>
                <Row
                  style={{ width: "100%", marginBottom: 10, marginTop: 10 }}
                  justify="center"
                >
                  <Tooltip placement="left" title="Top 2000" color="#f01f5a">
                    <Button
                      disabled={map.length === 0}
                      style={{ width: 200 }}
                      type="primary"
                      className={
                        info.top100 === 0 ? "button selected" : "button"
                      }
                      onClick={() => showTop100(0)}
                    >
                      Regular Plot
                    </Button>
                  </Tooltip>
                </Row>
                <Row
                  style={{ width: "100%", marginBottom: 10 }}
                  justify="center"
                >
                  <Button
                    disabled={map.length === 0}
                    style={{ width: 200 }}
                    type="primary"
                    className={
                      info.top100 === -1 ? "button selected" : "button"
                    }
                    onClick={() => showTop100(-1)}
                  >
                    Regular Plot <RightOutlined /> Zero
                  </Button>
                </Row>
                <Row
                  style={{ width: "100%", marginBottom: 10 }}
                  justify="center"
                >
                  <Tooltip placement="left" title="Top 300" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={
                        info.top100 === 1 ? "button selected" : "button"
                      }
                      onClick={() => showTop100(1)}
                    >
                      Settlement
                    </Button>
                  </Tooltip>
                </Row>
                <Row
                  style={{ width: "100%", marginBottom: 10 }}
                  justify="center"
                >
                  <Tooltip placement="left" title="Top 120" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={
                        info.top100 === 2 ? "button selected" : "button"
                      }
                      onClick={() => showTop100(2)}
                    >
                      Town
                    </Button>
                  </Tooltip>
                </Row>
                <Row
                  style={{ width: "100%", marginBottom: 10 }}
                  justify="center"
                >
                  <Tooltip placement="left" title="Top 120" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={
                        info.top100 === 3 ? "button selected" : "button"
                      }
                      onClick={() => showTop100(3)}
                    >
                      City
                    </Button>
                  </Tooltip>
                </Row>
                {info.top100 !== null ? (
                  <Row
                    style={{ width: "100%", marginTop: 20 }}
                    justify="center"
                  >
                    <Button
                      style={{ width: 200 }}
                      type="primary"
                      className="button"
                      onClick={() => showTop100(null)}
                    >
                      Reset Filters
                    </Button>
                  </Row>
                ) : null}
              </Row>
              <Row style={{ width: "100%", marginTop: 40 }} justify="center">
                {info.loading ? (
                  <LoadingOutlined
                    style={{ color: "white", fontSize: "3rem" }}
                  />
                ) : info.data !== undefined ? (
                  <Row className="box">
                    <Row
                      className="row100 title"
                      justify="center"
                      align="middle"
                    >
                      {info.data.type === 0 ? (
                        <img src={RPImage} style={{ width: 30 }} alt="plot" />
                      ) : info.data.type === 1 ? (
                        <img
                          src={SettlementImage}
                          style={{ width: 30 }}
                          alt="plot"
                        />
                      ) : info.data.type === 2 ? (
                        <img src={TownImage} style={{ width: 30 }} alt="plot" />
                      ) : info.data.type === 3 ? (
                        <img src={CityImage} style={{ width: 30 }} alt="plot" />
                      ) : (
                        <img
                          src={CapitalImage}
                          style={{ width: 30 }}
                          alt="plot"
                        />
                      )}
                      &nbsp;&nbsp;&nbsp;
                      {info.data.type === 0
                        ? "Regular Plot"
                        : info.data.type === 1
                        ? "Settlement Plot"
                        : info.data.type === 2
                        ? "Town Plot"
                        : info.data.type === 3
                        ? "City Plot"
                        : "Capital Plot"}
                    </Row>
                    <Row
                      className="row100 title"
                      style={{ marginTop: 20 }}
                      justify="center"
                    >
                      Coordinates
                    </Row>
                    <Row className="row100" justify="center">
                      X: {info.data.coordinates.x} &nbsp;Y:{" "}
                      {info.data.coordinates.y}
                    </Row>
                    {dataGuild
                      .filter(
                        (f) =>
                          f.x === info.data.coordinates.x &&
                          f.y === info.data.coordinates.y
                      )
                      .map((f) => (
                        <>
                          <Row
                            className="row100 title gtext"
                            style={{ marginTop: 20 }}
                            justify="center"
                          >
                            Guild Member
                          </Row>
                          <Row className="row100 gtext" justify="center">
                            {f.name}
                          </Row>
                        </>
                      ))}
                    <Row
                      className="row100 title"
                      style={{ marginTop: 20 }}
                      justify="center"
                    >
                      Top Local Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.isTop100 ? "Yes" : "No"}
                    </Row>
                    <Row
                      className="row100 title"
                      style={{ marginTop: 20 }}
                      justify="center"
                    >
                      Minimum Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.minReward} %
                    </Row>
                    <Row
                      className="row100 title"
                      style={{ marginTop: 20 }}
                      justify="center"
                    >
                      Maximum Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.maxReward} %
                    </Row>
                    <Row
                      className="row100 title"
                      style={{ marginTop: 20 }}
                      justify="center"
                    >
                      Average Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.averageReward} %
                    </Row>
                  </Row>
                ) : null}
              </Row>
            </Row>
          </Col>
        </Row>
        <Row style={{ width: "100%", marginTop: 100, marginBottom: 100 }}>
          <Row className="row100 title">Calculation Breakdown</Row>
          <Row className="row100 text">
            Using the information provided by ES from the sources below, I wrote
            a simple algorithm that iterates through each plot and calculates
            using the "20x20" area how each plot affects the rewards of the
            plots within the local area based on the multipliers of each plot
            type.
          </Row>
          <Row className="row100 text">
            After that, I recreated the map to allow filter by the average
            rewards scale based on plot types (Regular, Settlement, Town, City).
          </Row>
          <Row className="row100 text">
            For calculation purposes, I have assumed that the Capital multiplier
            is the same as the City multiplier (125) since this information is
            not available. Also, the "20x20" is a grey area because there is no
            way to have a square taking individual plots only into
            consideration. So on the top, you have two options, 21x21 or 19x19
            area.
          </Row>
          <Row className="row100 text">
            Minimum Reward is the minimum that a plot will receive if one of the
            local plots sells something.
          </Row>
          <Row className="row100 text">
            Maximum Reward is the maximum that a plot will receive if one of the
            local plots sells something.
          </Row>
          <Row className="row100 text">
            Average Reward is the Arithmetic Mean of all rewards obtained from
            the algorithm calculations.
          </Row>
          <Row className="row100 text"></Row>
          <Row className="row100 title" style={{ marginTop: 20 }}>
            Sources
          </Row>
          <Row className="row100 text">
            ES Medium Blog Post:&nbsp;
            <Typography.Link
              href="https://medium.com/embersword/the-vision-of-ember-sword-the-land-sale-1998be5e3fe5"
              target="_blank"
            >
              https://medium.com/embersword/the-vision-of-ember-sword-the-land-sale-1998be5e3fe5
            </Typography.Link>
          </Row>
          <Row className="row100 text">
            ES Website Map JSON:&nbsp;
            <Typography.Link
              href="https://embersword.com/map/solarwood.json"
              target="_blank"
            >
              https://embersword.com/map/solarwood.json
            </Typography.Link>
          </Row>
          <Row className="row100 title" style={{ marginTop: 20 }}>
            Author
          </Row>
          <Row className="row100 text">ES Discord User: mrcustodio</Row>
          <Row className="row100 text">
            Source Code (Algo + React Website): &nbsp;
            <Typography.Link
              href="https://github.com/mrcustodio/eslandreward"
              target="_blank"
            >
              https://github.com/mrcustodio/eslandreward
            </Typography.Link>
          </Row>
          <Row className="row100 title" style={{ marginTop: 20 }}>
            Modify by
          </Row>
          <Row className="row100 text">[EHiSTO] poucatelha</Row>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
