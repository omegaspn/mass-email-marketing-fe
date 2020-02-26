import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SendMail from ".";

configure({ adapter: new Adapter() });

describe("InputUpload component", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<SendMail />);
    expect(wrapper).toMatchSnapshot();
  });
});
