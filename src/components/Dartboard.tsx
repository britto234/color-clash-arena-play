
import React, { useState } from 'react';
import Dartboard3D from './Dartboard3D';

interface DartboardProps {
  onScore: (points: number) => void;
  disabled: boolean;
}

const Dartboard: React.FC<DartboardProps> = ({ onScore, disabled }) => {
  return <Dartboard3D onScore={onScore} disabled={disabled} />;
};

export default Dartboard;
