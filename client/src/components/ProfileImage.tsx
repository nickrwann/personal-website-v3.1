import profileImage from "@assets/generated_images/Professional_software_engineer_portrait_e44b99f5.png";

export function ProfileImage() {
  return (
    <div className="flex justify-center mb-6" data-testid="container-profile">
      <div className="relative">
        <img
          src={profileImage}
          alt="Nick Wanner"
          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover ring-1 ring-border"
          data-testid="img-profile"
        />
      </div>
    </div>
  );
}
