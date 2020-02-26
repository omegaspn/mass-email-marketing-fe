import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MailList from ".";

configure({ adapter: new Adapter() });

describe("MailList component", () => {
  it("should render correctly", () => {
    const mockData = [
      {
        email: "pear@gmail.com",
        user_name: "แพรกินจุ",
        user_next_rank_id: 3,
        reviews_left_to_uprank: 3
      }
    ];
    const wrapper = shallow(
      <MailList
        emailList={mockData}
        bodyList={[]}
        subjectList={[]}
        rankDict={{}}
        submitted={false}
        submittedCallback={jest.fn()}
        successAllCallback={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
