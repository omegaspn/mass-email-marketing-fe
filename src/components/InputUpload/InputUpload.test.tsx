import React from "react";
import Adapter from "enzyme-adapter-react-16";
import { shallow, configure } from "enzyme";
import InputUpload from ".";

configure({ adapter: new Adapter() });

describe("InputUpload component", () => {
  it("should render correctly", () => {
    const wrapper = shallow(<InputUpload />);
    expect(wrapper).toMatchSnapshot();
  });
});
