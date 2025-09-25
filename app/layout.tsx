import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'QuestFit — Adaptive Daily Workout Quests',
  description:
    'QuestFit turns training into adaptive daily quests, balancing enjoyment, recovery, and progression in a mobile-first Next.js experience.'
};

const RootLayout = ({
  children
}: {
  children: React.ReactNode;
}) => (
  <html lang="en">
    <body>
      <main>{children}</main>
      <footer>
        Crafted for personal use. Adapt freely — no guarantees.
      </footer>
    </body>
  </html>
);

export default RootLayout;
