export interface Dictionary {
  [code: string]: string;
}

export interface EmailData {
  email: string;
  user_name: string;
  user_next_rank_id: number;
  reviews_left_to_uprank: number;
}

export interface EmailList {
  email_list: EmailData[];
}
