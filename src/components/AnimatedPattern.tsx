import React, { useMemo, Component } from 'react';
import { motion } from 'framer-motion';
// Custom SVG Components for the specific requested elements
const DogIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M25,65 C25,65 15,60 10,50 C5,40 15,30 20,35 C20,35 22,20 35,15 C48,10 60,20 65,25 C70,30 85,25 90,30 C95,35 90,45 85,45 C85,45 90,50 90,55 C90,60 80,65 75,60 C75,60 75,75 70,80 C65,85 60,80 60,70 L50,70 C50,70 50,80 45,85 C40,90 35,80 35,70 L25,65 Z" />
    <circle cx="75" cy="35" r="2" fill="white" /> {/* Sparkling eye */}
  </svg>;
const PalmIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M50,100 C50,100 55,70 50,50 C50,50 80,40 90,50 C90,50 80,20 60,30 C60,30 60,10 50,5 C40,10 40,30 40,30 C20,20 10,50 10,50 C20,40 50,50 50,50 C45,70 50,100 50,100 Z" />
  </svg>;
const CarIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M10,60 L20,40 L70,40 L85,60 L95,60 L95,80 L5,80 L5,60 Z M25,80 A10,10 0 0,1 25,100 A10,10 0 0,1 25,80 M75,80 A10,10 0 0,1 75,100 A10,10 0 0,1 75,80" />
  </svg>;
const MusicNoteIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>;
const HeartIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>;
const FlowerIcon = ({
  color
}: {
  color: string;
}) => <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full" style={{
  color
}}>
    <path d="M12 2L14.5 9H22L16 13.5L18.5 20.5L12 16L5.5 20.5L8 13.5L2 9H9.5L12 2Z" />{' '}
    {/* Star-like flower */}
  </svg>;
// Configuration for floating elements
const ELEMENTS = [{
  type: 'dog',
  color: '#8B4513',
  count: 4,
  size: 60
}, {
  type: 'heart',
  color: 'var(--heart-pink)',
  count: 8,
  size: 30
}, {
  type: 'note',
  color: 'var(--wildflower-purple)',
  count: 6,
  size: 40
}, {
  type: 'flower',
  color: 'var(--wildflower-yellow)',
  count: 5,
  size: 35
}, {
  type: 'flower',
  color: 'var(--wildflower-red)',
  count: 5,
  size: 35
}, {
  type: 'palm',
  color: 'var(--nature-green)',
  count: 4,
  size: 80
}, {
  type: 'car',
  color: 'var(--sunset-orange)',
  count: 3,
  size: 70
}];
export function AnimatedPattern() {
  // Generate random positions for elements
  const items = useMemo(() => {
    const generatedItems: any[] = [];
    let idCounter = 0;
    ELEMENTS.forEach(group => {
      for (let i = 0; i < group.count; i++) {
        generatedItems.push({
          id: idCounter++,
          type: group.type,
          color: group.color,
          size: group.size * (0.8 + Math.random() * 0.4),
          initialX: Math.random() * 100,
          initialY: Math.random() * 100,
          duration: 15 + Math.random() * 20,
          delay: Math.random() * 5,
          rotationRange: Math.random() > 0.5 ? 15 : -15
        });
      }
    });
    return generatedItems;
  }, []);
  const getIcon = (type: string, color: string) => {
    switch (type) {
      case 'dog':
        return <DogIcon color={color} />;
      case 'heart':
        return <HeartIcon color={color} />;
      case 'note':
        return <MusicNoteIcon color={color} />;
      case 'flower':
        return <FlowerIcon color={color} />;
      case 'palm':
        return <PalmIcon color={color} />;
      case 'car':
        return <CarIcon color={color} />;
      default:
        return <div />;
    }
  };
  return <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Gradient Animation */}
      <motion.div className="absolute inset-0 opacity-30" animate={{
      background: ['linear-gradient(to bottom right, var(--sunset-pink), var(--sunset-gold))', 'linear-gradient(to bottom right, var(--sunset-orange), var(--sunset-pink))', 'linear-gradient(to bottom right, var(--sunset-gold), var(--sunset-coral))', 'linear-gradient(to bottom right, var(--sunset-pink), var(--sunset-gold))']
    }} transition={{
      duration: 20,
      repeat: Infinity,
      ease: 'linear'
    }} />

      {/* Floating Elements */}
      {items.map(item => <motion.div key={item.id} className="absolute" style={{
      left: `${item.initialX}%`,
      top: `${item.initialY}%`,
      width: item.size,
      height: item.size,
      opacity: 0.6
    }} initial={{
      y: 0,
      rotate: 0
    }} animate={{
      y: [0, -100, 0],
      x: [0, 50, 0],
      rotate: [0, item.rotationRange, 0],
      scale: item.type === 'heart' ? [1, 1.2, 1] : 1 // Pulse hearts
    }} transition={{
      duration: item.duration,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: item.delay
    }}>
          {getIcon(item.type, item.color)}
        </motion.div>)}

      {/* Specific Bounding Dog Animation (Extra special one) */}
      <motion.div className="absolute bottom-10 left-[-100px] w-24 h-24 z-10 opacity-80" animate={{
      x: ['-10vw', '110vw'],
      y: [0, -20, 0, -20, 0] // Bouncing motion
    }} transition={{
      duration: 12,
      repeat: Infinity,
      ease: 'linear',
      delay: 2,
      repeatDelay: 5
    }}>
        <DogIcon color="#8B4513" />
      </motion.div>
    </div>;
}