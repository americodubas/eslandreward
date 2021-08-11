import React, { useEffect, useState } from "react";
import { Row, Layout, Button, Col, Typography, Tooltip } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "./App.css";

//Map Source
import average10 from "./assets/average10.json";
import average9 from "./assets/average9.json";

//Images
import RPImage from "./assets/regular_plots.png";
import SettlementImage from "./assets/settlement_plot.png";
import TownImage from "./assets/town_plot.png";
import CityImage from "./assets/city_plot.png";
import CapitalImage from "./assets/capital_plot.png";
import ESLogo from "./assets/logo@2x.png";
import SolarwoodImage from "./assets/go-icon_nationSolarwood.webp";

function App() {
  const { Content } = Layout;

  const [map, setMap] = useState([]);
  const [info, setInfo] = useState({
    loading: false,
    data: undefined,
    top100: null,
    areaType: 21,
  });

  useEffect(() => {
    generateMap();
    //eslint-disable-next-line
  }, [info.top100, info.areaType]);

  const generateMap = () => {
    let data = [...average10];
    if (info.areaType === 19) {
      data = [...average9];
    }
    const columns = [...Array(200).keys()].reverse().map((m) => {
      return data.filter((f) => f.coordinates.y === m).sort((a, b) => a.coordinates.x - b.coordinates.x);
    });

    setTimeout(() => {
      setMap(columns);
    }, 100);
  };

  return (
    <Layout className="layout body">
      <Content style={{ padding: "0 50px" }}>
        <Row className="row100 title" style={{ marginBottom: 20 }} align="middle" justify="space-between">
          <span>
            <img src={ESLogo} style={{ width: 50 }} alt="plot" />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ember Sword - Local Land Reward Scale (2.5%)
          </span>
          <span>
            Solarwood <img src={SolarwoodImage} style={{ width: 45 }} alt="plot" />
            &nbsp;&nbsp;
            <Button
              disabled={info.areaType === 21}
              type="primary"
              className={info.areaType === 21 ? "button selected" : "button"}
              onClick={() => {
                setMap([]);
                setInfo({ ...info, data: undefined, top100: null, areaType: 21 });
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
                setMap([]);
                setInfo({ ...info, data: undefined, top100: null, areaType: 19 });
              }}
            >
              19x19
            </Button>
          </span>
        </Row>
        <Row style={{ width: "100%" }}>
          <Col xs={24} xl={18}>
            {map.length === 0 ? (
              <Row className="loading">
                <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
              </Row>
            ) : (
              <div className="map">
                {map.map((row, i) => {
                  return (
                    <div className="row" key={i}>
                      {row.map((col, ii) => (
                        <div
                          key={i + "-" + ii}
                          onClick={() => {
                            setInfo({ ...info, loading: true });
                            setTimeout(() => {
                              setInfo({ ...info, data: col, loading: false });
                            }, 600);
                          }}
                          className={
                            col.coordinates.x +
                            "-" +
                            col.coordinates.y +
                            (info.data && info.data.index === col.index
                              ? " col selected"
                              : col.isTop100 && col.type === info.top100
                              ? " col top"
                              : col.type === 0
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
                        ></div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </Col>
          <Col style={{ backgroundColor: "#0c161c" }} xs={24} xl={6}>
            <Row style={{ width: "100%" }}>
              <Row style={{ paddingLeft: 50, marginTop: 10, width: "100%" }}>
                <Row className="row100 title" justify="center" align="middle">
                  Top Reward Filter
                </Row>
                <Row style={{ width: "100%", marginBottom: 10, marginTop: 10 }} justify="center">
                  <Tooltip placement="left" title="Top 2000" color="#f01f5a">
                    <Button
                      disabled={map.length === 0}
                      style={{ width: 200 }}
                      type="primary"
                      className={info.top100 === 0 ? "button selected" : "button"}
                      onClick={() => setInfo({ ...info, top100: 0 })}
                    >
                      Regular Plot
                    </Button>
                  </Tooltip>
                </Row>
                <Row style={{ width: "100%", marginBottom: 10 }} justify="center">
                  <Tooltip placement="left" title="Top 300" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={info.top100 === 1 ? "button selected" : "button"}
                      onClick={() => setInfo({ ...info, top100: 1 })}
                    >
                      Settlement
                    </Button>
                  </Tooltip>
                </Row>
                <Row style={{ width: "100%", marginBottom: 10 }} justify="center">
                  <Tooltip placement="left" title="Top 120" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={info.top100 === 2 ? "button selected" : "button"}
                      onClick={() => setInfo({ ...info, top100: 2 })}
                    >
                      Town
                    </Button>
                  </Tooltip>
                </Row>
                <Row style={{ width: "100%", marginBottom: 10 }} justify="center">
                  <Tooltip placement="left" title="Top 120" color="#f01f5a">
                    <Button
                      style={{ width: 200 }}
                      disabled={map.length === 0}
                      type="primary"
                      className={info.top100 === 3 ? "button selected" : "button"}
                      onClick={() => setInfo({ ...info, top100: 3 })}
                    >
                      City
                    </Button>
                  </Tooltip>
                </Row>
                {info.top100 !== null ? (
                  <Row style={{ width: "100%", marginTop: 20 }} justify="center">
                    <Button
                      style={{ width: 200 }}
                      type="primary"
                      className="button"
                      onClick={() => setInfo({ ...info, top100: null })}
                    >
                      Reset Filters
                    </Button>
                  </Row>
                ) : null}
              </Row>
              <Row style={{ width: "100%", marginTop: 50, paddingLeft: 50 }} justify="center">
                {info.loading ? (
                  <LoadingOutlined style={{ color: "white", fontSize: "3rem" }} />
                ) : info.data !== undefined ? (
                  <Row className="box">
                    <Row className="row100">{console.log(info)}</Row>
                    <Row className="row100 title" justify="center" align="middle">
                      {info.data.type === 0 ? (
                        <img src={RPImage} style={{ width: 30 }} alt="plot" />
                      ) : info.data.type === 1 ? (
                        <img src={SettlementImage} style={{ width: 30 }} alt="plot" />
                      ) : info.data.type === 2 ? (
                        <img src={TownImage} style={{ width: 30 }} alt="plot" />
                      ) : info.data.type === 3 ? (
                        <img src={CityImage} style={{ width: 30 }} alt="plot" />
                      ) : (
                        <img src={CapitalImage} style={{ width: 30 }} alt="plot" />
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
                    <Row className="row100 title" style={{ marginTop: 20 }} justify="center">
                      Coordinates
                    </Row>
                    <Row className="row100" justify="center">
                      X: {info.data.coordinates.x} &nbsp;Y: {info.data.coordinates.y}
                    </Row>
                    <Row className="row100 title" style={{ marginTop: 20 }} justify="center">
                      Top Local Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.isTop100 ? "Yes" : "No"}
                    </Row>
                    <Row className="row100 title" style={{ marginTop: 20 }} justify="center">
                      Minimum Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.minReward} %
                    </Row>
                    <Row className="row100 title" style={{ marginTop: 20 }} justify="center">
                      Maximum Reward
                    </Row>
                    <Row className="row100" justify="center">
                      {info.data.maxReward} %
                    </Row>
                    <Row className="row100 title" style={{ marginTop: 20 }} justify="center">
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
            Using the information provided by ES from the sources below, I wrote a simple algorithm that iterates
            through each plot and calculates using the "20x20" area how each plot affects the rewards of the plots
            within the local area based on the multipliers of each plot type.
          </Row>
          <Row className="row100 text">
            After that, I recreated the map to allow filter by the average rewards scale based on plot types (Regular,
            Settlement, Town, City).
          </Row>
          <Row className="row100 text">
            For calculation purposes, I have assumed that the Capital multiplier is the same as the City multiplier
            (125) since this information is not available. Also, the "20x20" is a grey area because there is no way to
            have a square taking individual plots only into consideration. So on the top, you have two options, 21x21 or
            19x19 area.
          </Row>
          <Row className="row100 text">
            Minimum Reward is the minimum that a plot will receive if one of the local plots sells something.
          </Row>
          <Row className="row100 text">
            Maximum Reward is the maximum that a plot will receive if one of the local plots sells something.
          </Row>
          <Row className="row100 text">
            Average Reward is the Arithmetic Mean of all rewards obtained from the algorithm calculations.
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
            <Typography.Link href="https://embersword.com/map/solarwood.json" target="_blank">
              https://embersword.com/map/solarwood.json
            </Typography.Link>
          </Row>
          <Row className="row100 title" style={{ marginTop: 20 }}>
            Author
          </Row>
          <Row className="row100 text">ES Discord User: mrcustodio</Row>
          <Row className="row100 text">
            Source Code (Algo + React Website): &nbsp;
            <Typography.Link href="https://github.com/mrcustodio/eslandreward" target="_blank">
              https://github.com/mrcustodio/eslandreward
            </Typography.Link>
          </Row>
        </Row>
      </Content>
    </Layout>
  );
}

export default App;
