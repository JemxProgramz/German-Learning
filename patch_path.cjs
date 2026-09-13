const fs = require('fs');
let content = fs.readFileSync('src/views/LearningPath.tsx', 'utf8');

content = content.replace("export function LearningPathView() {", `export function LearningPathView({ onNavigate }: { onNavigate?: (view: string) => void }) {`);

content = content.replace(/<button \n\s+className=\{\`relative \$\{node\.isCheckpoint/, `<button 
                  onClick={() => {
                    if (!isLocked && onNavigate) {
                      // Logic to pick the right view based on the node's Icon or index
                      const views = ['vocabulary', 'horen', 'schreiben', 'sprechen'];
                      const viewTarget = node.isCheckpoint ? 'mocktest' : views[index % views.length];
                      onNavigate(viewTarget);
                    }
                  }}
                  className={\`relative \${node.isCheckpoint`);

fs.writeFileSync('src/views/LearningPath.tsx', content);
