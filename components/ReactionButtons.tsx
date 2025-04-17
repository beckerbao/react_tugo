import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Reaction = 'like' | 'love' | null;

interface ReactionButtonsProps {
  postId: number;
  initialReaction: Reaction;
  likes: number;
  loves: number;
  onReactionSent: (reaction: Reaction) => void;
  disabled?: boolean; // nếu user chưa login
  onLoginRequired?: () => void; // hàm gọi modal nếu chưa login
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  postId,
  initialReaction,
  likes,
  loves,
  onReactionSent,
  disabled = false,
  onLoginRequired,
}) => {
    const [current, setCurrent] = useState<Reaction>(initialReaction);
    const [likeCount, setLikeCount] = useState<number>(likes ?? 0);
    const [loveCount, setLoveCount] = useState<number>(loves ?? 0);

    useEffect(() => {
        // Nếu mismatch → force reset state
        // console.log('[ReactionButtons] initialReaction:', initialReaction, 'current:', current);
        if (initialReaction !== current) {
          setCurrent(initialReaction);
        }
        
        setLikeCount(likes ?? 0);
        setLoveCount(loves ?? 0);

      }, [initialReaction, likes, loves]);
    console.log('[ReactionButtons] postId:', postId, 'initialReaction:', initialReaction, 'current:', current);


  const handlePress = (reaction: Reaction) => {
    if (disabled) {
      onLoginRequired?.();
      return;
    }

    if (current === reaction) {
    //   nextReaction = null; // toggle off
        return;
    }

    const nextReaction: Reaction = reaction;

    // Optimistic update
    // Xử lý chuyển đổi reaction
    if (current === 'like') {
        setLikeCount(likeCount - 1);
    } else if (current === 'love') {
        setLoveCount(loveCount - 1);
    }

    if (nextReaction === 'like') {
        setLikeCount((prev) => prev + 1);
    } else if (nextReaction === 'love') {
        setLoveCount((prev) => prev + 1);
    }

    setCurrent(nextReaction);
    onReactionSent(nextReaction);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, current === 'like' && styles.selected]}
        onPress={() => handlePress('like')}
      >
        <Text>👍 {likeCount}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, current === 'love' && styles.selected]}
        onPress={() => handlePress('love')}
      >
        <Text>❤️ {loveCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  selected: {
    backgroundColor: '#ccc',
  },
});
