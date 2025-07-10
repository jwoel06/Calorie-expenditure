import React from 'react';

function Calculate() {
  return (
    <div>
      <h1>Estimate Your Calorie Expenditure!</h1>
      <h3>How it works...</h3>
      <p>Input your Sex, Age, Duration of Workout (Minutes), Average Heart Reate (BPM), and Workout Intensity</p>
      <form>
        <label htmlFor="sex">Sex</label><br />
        <input type="text" id="sex" name="sex" /><br />
        <label htmlFor="age">Age</label><br />
        <input type="text" id="age" name="age" /><br />
        <label htmlFor="tduration">Length Of Workout</label><br />
        <input type="text" id="tduration" name="tduration" /><br />
        <label htmlFor="hrate">Heart Rate (BPM)</label><br />
        <input type="text" id="hrate" name="hrate" /><br />
        <label htmlFor="hrate">Intensity</label><br />
        <input type="text" id="intensity" name="intensity" /><br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Calculate;