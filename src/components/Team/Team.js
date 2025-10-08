import React from "react";
import styles from "./Team.module.css";
import Container from "@/layouts/Container";
import TitleV2 from "@/layouts/TitleV2";
import InfiniteScrollCarousel from "@/layouts/InfiniteScrollCarousel";
import MemberCard from "./MemberCard";

const MEMBERS = [
  {
    id: 1,
    name: "Maria Wilson",
    role: "Video Editor",
    image: "/images/memberPhotos/member1.png",
  },
  {
    id: 2,
    name: "James Carter",
    role: "Project Manager",
    image: "/images/memberPhotos/member2.png",
  },
  {
    id: 3,
    name: "Sophia Lee",
    role: "UI/UX Designer",
    image: "/images/memberPhotos/member3.png",
  },
  {
    id: 4,
    name: "Daniel Kim",
    role: "Full Stack Developer",
    image: "/images/memberPhotos/member4.png",
  },
];

function Team() {
  return (
    <div>
      <Container>
        <TitleV2 title="Meet Our Team" />
        <div
          id="overlay"
          style={{
            padding: "50px 0",
          }}
        >
          <InfiniteScrollCarousel gap={20} speed={0.5}>
            {MEMBERS.map((member, index) => (
              <MemberCard key={index} data={member} />
            ))}
          </InfiniteScrollCarousel>
        </div>
      </Container>
    </div>
  );
}

export default Team;
