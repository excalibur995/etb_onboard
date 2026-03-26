import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface RichTextWidgetProps {
  text: any[];
}

// A simple fallback renderer since we don't have a markdown/HTML library installed yet.
// It tries to extract the text content from the structured rich text blocks (Strapi Blocks format).
const renderNode = (node: any, index: number) => {
  if (node.type === 'text') {
    return (
      <Text
        key={index}
        style={[
          node.bold && styles.bold,
          node.italic && styles.italic,
          node.underline && styles.underline,
          node.strikethrough && styles.strikethrough,
        ]}
      >
        {node.text}
      </Text>
    );
  }

  if (node.type === 'paragraph') {
    return (
      <Text key={index} style={styles.paragraph}>
        {node.children?.map((child: any, i: number) => renderNode(child, i))}
      </Text>
    );
  }

  if (node.type === 'heading') {
    const levelStyle =
      node.level === 1
        ? styles.h1
        : node.level === 2
        ? styles.h2
        : node.level === 3
        ? styles.h3
        : node.level === 4
        ? styles.h4
        : styles.h5;

    return (
      <Text key={index} style={[styles.heading, levelStyle]}>
        {node.children?.map((child: any, i: number) => renderNode(child, i))}
      </Text>
    );
  }

  if (node.type === 'list') {
    return (
      <View key={index} style={styles.list}>
        {node.children?.map((child: any, i: number) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.bullet}>
              {node.format === 'ordered' ? `${i + 1}.` : '•'}
            </Text>
            <Text style={styles.listItemText}>
              {child.children?.map((grandchild: any, j: number) =>
                renderNode(grandchild, j),
              )}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // Fallback for unknown node types that might have children
  return (
    <Text key={index}>
      {node.children?.map((child: any, i: number) => renderNode(child, i))}
    </Text>
  );
};

export const RichTextWidget: React.FC<RichTextWidgetProps> = ({
  text = [],
}) => {
  return <View style={styles.container}>{text.map(renderNode)}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    width: '100%',
  },
  paragraph: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 12,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  underline: {
    textDecorationLine: 'underline',
  },
  strikethrough: {
    textDecorationLine: 'line-through',
  },
  heading: {
    color: '#111827',
    fontWeight: 'bold',
  },
  h1: { fontSize: 20 },
  h2: { fontSize: 16 },
  h3: { fontSize: 14 },
  h4: { fontSize: 12 },
  h5: { fontSize: 10 },
  list: {
    marginVertical: 8,
    paddingLeft: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 24,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  listItemText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
});
