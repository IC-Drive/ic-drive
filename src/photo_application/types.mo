import Principal "mo:base/Principal";

module {
  public type UserId = Principal;

  public type NewProfile = {
		firstName : Text;
		lastName : Text;
		img : Text;
  };

  public type Profile = {
    id: UserId;
    firstName : Text;
		lastName : Text;
		img: Text;
  };
};
