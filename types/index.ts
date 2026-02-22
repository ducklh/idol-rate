export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
};

export type Idol = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Vote = {
  id: string;
  user_id: string;
  idol_id: string;
  star: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

export type IdolWithStats = Idol & {
  average_star: number | null;
  total_votes: number;
};

export type VoteWithProfile = Vote & {
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
};
