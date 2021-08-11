const file = require("./dataset.json");
const fileparsed = require("./parsed.json");
const averages = require("./averages.json");

const fs = require("fs");
//----------------------
const areaSize = 9;
//main();
averagesGen();
//----------------------

async function averagesGen() {
  for (let i = 0; i < fileparsed.length; i++) {
    const curr = fileparsed[i];
    const limits = getLimits(curr.coordinates);
    const localArea = fileparsed.filter(
      (f) =>
        f.coordinates.x >= limits.left &&
        f.coordinates.x <= limits.right &&
        f.coordinates.y >= limits.bottom &&
        f.coordinates.y <= limits.top
    );

    const type0 = localArea.filter((f) => f.type === 0);
    const type1 = localArea.filter((f) => f.type === 1);
    const type2 = localArea.filter((f) => f.type === 2);
    const type3 = localArea.filter((f) => f.type === 3);
    const type4 = localArea.filter((f) => f.type === 4);

    const points0 = type0.length;
    const points1 = type1.length * 10;
    const points2 = type2.length * 50;
    const points3 = type3.length * 125;
    const points4 = type4.length * 125;

    const totalPoints = points0 + points1 + points2 + points3 + points4;

    const avr0 = points0 / totalPoints / (type0.length === 0 ? 1 : type0.length);
    const avr1 = points1 / totalPoints / (type1.length === 0 ? 1 : type1.length);
    const avr2 = points2 / totalPoints / (type2.length === 0 ? 1 : type2.length);
    const avr3 = points3 / totalPoints / (type3.length === 0 ? 1 : type3.length);
    const avr4 = points4 / totalPoints / (type4.length === 0 ? 1 : type4.length);

    type0.map((m) => {
      fileparsed[m.index].rewards.push(avr0);
    });
    type1.map((m) => {
      fileparsed[m.index].rewards.push(avr1);
    });
    type2.map((m) => {
      fileparsed[m.index].rewards.push(avr2);
    });
    type3.map((m) => {
      fileparsed[m.index].rewards.push(avr3);
    });
    type4.map((m) => {
      fileparsed[m.index].rewards.push(avr4);
    });
  }

  for (let i = 0; i < fileparsed.length; i++) {
    const rewards = [...fileparsed[i].rewards];
    fileparsed[i].averageReward = toPercentage(rewards.reduce((p, c) => p + c, 0) / rewards.length);
    fileparsed[i].minReward = toPercentage(Math.min(...rewards));
    fileparsed[i].maxReward = toPercentage(Math.max(...rewards));
    delete fileparsed[i].price;
    delete fileparsed[i].rewards;
  }

  const sortAverage = averages.sort((a, b) => b.averageReward - a.averageReward);
  const type0 = sortAverage.filter((f) => f.type === 0).slice(0, 499);
  const type1 = sortAverage.filter((f) => f.type === 1).slice(0, 199);
  const type2 = sortAverage.filter((f) => f.type === 2).slice(0, 99);
  const type3 = sortAverage.filter((f) => f.type === 3).slice(0, 99);
  const type4 = sortAverage.filter((f) => f.type === 4).slice(0, 99);

  for (let i = 0; i < fileparsed.length; i++) {
    if (fileparsed[i].type === 0) {
      fileparsed[i].isTop100 = type0.find((f) => f.index === i) !== undefined;
    } else if (fileparsed[i].type === 1) {
      fileparsed[i].isTop100 = type1.find((f) => f.index === i) !== undefined;
    } else if (fileparsed[i].type === 2) {
      fileparsed[i].isTop100 = type2.find((f) => f.index === i) !== undefined;
    } else if (fileparsed[i].type === 3) {
      fileparsed[i].isTop100 = type3.find((f) => f.index === i) !== undefined;
    } else if (fileparsed[i].type === 4) {
      fileparsed[i].isTop100 = type4.find((f) => f.index === i) !== undefined;
    }
  }

  let data = JSON.stringify(fileparsed);
  fs.writeFileSync("average9.json", data);
  console.log("done");
}

async function concatChildren() {
  const c = [].concat
    .apply(
      [],
      file.map((m) => {
        return m.children.map((mm) => ({
          ...mm,
          size: m.size,
          rewards: [],
          coordinates: { x: m.coordinates.x + mm.coordinates.x, y: m.coordinates.y + mm.coordinates.y },
        }));
      })
    )
    .map((m, i) => ({ ...m, index: i }));

  let data = JSON.stringify(c);
  fs.writeFileSync("concated.json", data);
}

function toPercentage(float) {
  return parseFloat((float * 100).toFixed(8));
}

function getLimits(coordinates) {
  const top = coordinates.y + areaSize;
  const bottom = coordinates.y - areaSize;
  const left = coordinates.x - areaSize;
  const right = coordinates.x + areaSize;
  return {
    top: top > 199 ? 199 : top,
    bottom: bottom < 0 ? 0 : bottom,
    left: left < 0 ? 0 : left,
    right: right > 199 ? 199 : right,
  };
}
