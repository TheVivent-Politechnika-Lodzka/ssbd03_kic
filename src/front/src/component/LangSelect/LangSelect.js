import "./style.scss";
import i18next from "i18next";
import { useState } from "react";
import Cookies from "js-cookie";

const LangSelect = () => {
  Cookies.get("username");
  const [value, setValue] = useState();
  return (
    <select
      name="lang"
      id="lang-select"
      onChange={(e) => {
        setValue(e.target.value);
        i18next.changeLanguage(e.target.value);
      }}
      defaultValue={Cookies.get("i18next")}
      value={value}
    >
      <option value="en">ENG</option>
      <option value="pl">PL</option>
    </select>
  );
};

export default LangSelect;