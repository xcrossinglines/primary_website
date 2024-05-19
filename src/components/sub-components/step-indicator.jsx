import React from "react";

//
// export partial reuseable component
export function StepIndicator({ currentStep, stepsLength }) {
  // return <EmojiRating selected={0} iconSize={30} onSelected={() => {}} />;

  // variables
  const cirlceSize = 30 / 16;

  // list variables
  const listStep = Array(stepsLength).fill(0);
  // create circle
  const Circle = ({ step, active }) => {
    return (
      <div
        style={{
          width: `${cirlceSize}rem`,
          height: `${cirlceSize}rem`,
          borderRadius: `${cirlceSize / 2}rem`,
          color: "white",
          fontWeight: 900,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: active ? "var(--secondary-color)" : "grey",
        }}
      >
        {step}
      </div>
    );
  };

  // create bar
  const Bar = ({ active }) => {
    return (
      <div
        style={{
          width: "100%",
          height: "5px",
          borderRadius: `${5 / 2}rem`,
          backgroundColor: active ? "var(--secondary-color)" : "grey",
          border: active ? "var(--secondary-color) solid 2px" : "none",
        }}
      />
    );
  };

  // combination
  const CircleBar = ({ step, active, showBar, keyy }) => {
    return (
      <div
        key={keyy}
        style={{
          display: "flex",
          gap: "4px",
          flexDirection: "row",
          alignItems: "center",
          width: showBar ? "100%" : "",
        }}
      >
        <div>
          <Circle key={`${keyy}-Circle`} active={active} step={step} />
        </div>
        {showBar ? <Bar key={`${keyy}-Bar`} active={active} /> : <></>}
      </div>
    );
  };

  return (
    <div
      className="my-3"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "250px",
        gap: "4px",
        // border: "red solid 5px",
      }}
    >
      {listStep.map((__, step) => {
        return (
          <CircleBar
            key={step}
            step={step + 1}
            showBar={!(step + 1 >= listStep.length)}
            active={currentStep >= step + 1}
          />
        );
      })}
    </div>
  );
}
